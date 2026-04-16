import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  async createBusiness(data: CreateBusinessDto) {
    // İşletmeyi oluştur ve veritabanına yaz
    const newBusiness = await this.prisma.business.create({
      data: {
        name: data.name,
        address: data.address,
        userId: data.userId, // Kayıt olan user'ın ID'si
        openTime: data.openTime,
        closeTime: data.closeTime,
      },
    });

    return { 
      message: 'İşletme başarıyla oluşturuldu', 
      business: newBusiness 
    };
  }
  async getAllBusinesses() {
    return this.prisma.business.findMany();
  }
  // İşletme bilgilerini güncelle
  async updateBusiness(id: number, data: any) {
    // Veritabanında güncelleme (PATCH) işlemi
    return this.prisma.business.update({
      where: { id: Number(id) },
      data: data, // Frontend'den gelen değişmiş veriler
    });
  }
}