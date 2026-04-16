import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async createReservation(data: CreateReservationDto) {
    const reservationDate = new Date(data.date);

    // 1. KONTROL: Dükkan var mı?
    const businessExists = await this.prisma.business.findUnique({
      where: { id: data.businessId },
    });
    if (!businessExists) throw new NotFoundException('İşletme bulunamadı.');

    // 2. KONTROL: Hizmet var mı?
    const serviceExists = await this.prisma.service.findUnique({
      where: { id: data.serviceId },
    });
    if (!serviceExists) throw new NotFoundException('Hizmet bulunamadı.');

    // 3. KONTROL (KAPASİTE): Bu dükkanda, bu tarihte ve bu saatte kaç randevu var?
    const existingReservationsCount = await this.prisma.reservation.count({
      where: {
        businessId: data.businessId,
        date: reservationDate,
        time: data.time, 
      },
    });

    if (existingReservationsCount >= 2) {
      throw new BadRequestException('Üzgünüz, seçtiğiniz saat için kapasite doludur.');
    }

    // 4. KAYIT
    const newReservation = await this.prisma.reservation.create({
      data: {
        date: reservationDate,
        time: data.time,
        userId: data.userId,
        businessId: data.businessId,
        serviceId: data.serviceId,
      },
    });

    return {
      message: 'Rezervasyon başarıyla oluşturuldu!',
      reservation: newReservation,
    };
  }

  // Müşterinin kendi randevularını görmesi
  async getUserReservations(userId: number) {
    return this.prisma.reservation.findMany({
      where: { userId: Number(userId) },
      include: {
        business: true, 
        service: true,  
      },
    });
  }

  // İşletme sahibinin kendi dükkanındaki randevuları görmesi
  async getBusinessReservations(businessId: number) {
    return this.prisma.reservation.findMany({
      where: { businessId: Number(businessId) },
      include: {
        user: { select: { email: true } }, 
        service: true,                     
      },
    });
  }

  // Boş saatleri hesaplama algoritması
  async getAvailableHours(businessId: number, date: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: Number(businessId) },
    });

    if (!business) throw new NotFoundException('İşletme bulunamadı.');

    const reservationDate = new Date(date);
    const existingReservations = await this.prisma.reservation.findMany({
      where: {
        businessId: Number(businessId),
        date: reservationDate,
      },
    });

    const availableHours: string[] = [];

    // İşletmenin açılış saatinden kapanış saatine kadar döngü
    for (let hour = business.openTime; hour < business.closeTime; hour++) {
      // Saati "09:00", "14:00" formatında garantilemek için padStart ekledik
      const timeString = `${hour.toString().padStart(2, '0')}:00`; 
      
      const count = existingReservations.filter(r => r.time === timeString).length;

      // 2'den az randevu varsa boş saatlere ekle
      if (count < 2) {
        availableHours.push(timeString);
      }
    }

    return { 
      date: date, 
      availableHours: availableHours 
    };
  }
}