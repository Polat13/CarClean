import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  async createBusiness(data: CreateBusinessDto) {
    const newBusiness = await this.prisma.business.create({
      data: {
        name: data.name,
        address: data.address,
        userId: data.userId,
        phone: data.phone,
        city: data.city,
        district: data.district,
        description: data.description,
        logoUrl: data.logoUrl,
        openTime: data.openTime,
        closeTime: data.closeTime,
      },
    });

    return {
      message: 'İşletme başarıyla oluşturuldu',
      business: newBusiness,
    };
  }

  async getAllBusinesses() {
    return this.prisma.business.findMany();
  }

  async getBusinessByOwnerId(userId: number) {
    return this.prisma.business.findFirst({
      where: { userId: Number(userId) },
    });
  }

  async getBusinessById(id: number) {
    return this.prisma.business.findUnique({
      where: { id: Number(id) },
    });
  }

  async updateBusiness(id: number, data: Prisma.BusinessUpdateInput) {
    return this.prisma.business.update({
      where: { id: Number(id) },
      data,
    });
  }
}
