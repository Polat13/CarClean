import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async createService(data: CreateServiceDto) {
    // 1. KURAL: Bu hizmeti eklemeye çalıştığımız dükkan (Business) gerçekten var mı?
    const businessExists = await this.prisma.business.findUnique({
      where: { id: data.businessId },
    });

    if (!businessExists) {
      throw new NotFoundException('Böyle bir işletme bulunamadı, hizmet eklenemez.');
    }

    // 2. KURAL: Dükkan varsa, hizmeti veritabanına kaydet.
    const newService = await this.prisma.service.create({
      data: {
        name: data.name,
        price: data.price,
        duration: data.duration,
        businessId: data.businessId,
      },
    });

    return {
      message: 'Hizmet başarıyla dükkana eklendi',
      service: newService,
    };
  }
  async getServicesByBusiness(businessId: number) {
    return this.prisma.service.findMany({
      where: { businessId: Number(businessId) }, // Gelen ID'ye göre filtrele
    });
  }
  // Hizmet bilgilerini (fiyat, süre vb.) güncelle
  async updateService(id: number, data: any) {
    return this.prisma.service.update({
      where: { id: Number(id) },
      data: data,
    });
  }
}