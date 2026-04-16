import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // İşte antigravity etkisi burada!
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Diğer modüllerin PrismaService'e ulaşmasını sağlar
})
export class PrismaModule {}
