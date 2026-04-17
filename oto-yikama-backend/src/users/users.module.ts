import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'GIZLI_ANAHTAR_BURAYA', // Gerçek projede .env içinde tutulur
      signOptions: { expiresIn: '7d' }, // 7 gün geçerli olsun
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule { }
