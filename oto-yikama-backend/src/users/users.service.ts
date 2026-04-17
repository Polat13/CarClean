import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  async createUser(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('Bu email adresi zaten kullanılıyor.');
    }

    const newUser = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role || 'customer',
      },
    });

    return {
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      }
    };
  }
  // NOT: Constructor'da 'private jwtService: JwtService' ekli olmalı!
  async loginUser(data: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || user.password !== data.password) {
      throw new UnauthorizedException('Email veya şifre hatalı!');
    }

    // --- KRİTİK EKLEME: JWT TOKEN ÜRETİMİ ---
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Giriş başarılı!',
      access_token: token, // Frontend artık bunu bekliyor
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    };
  }
}