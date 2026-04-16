import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Proje (backend) çalışmaya başladığında veritabanına bağlan
  async onModuleInit() {
    await this.$connect();
  }

  // Proje durdurulduğunda veritabanı bağlantısını güvenli bir şekilde kes
  async onModuleDestroy() {
    await this.$disconnect();
  }
}