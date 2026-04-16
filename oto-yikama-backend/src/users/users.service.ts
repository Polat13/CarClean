import { Injectable, BadRequestException , UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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
  async loginUser(data: LoginUserDto) {
    // 1. Veritabanında bu emaile sahip biri var mı?
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    // 2. Kullanıcı yoksa VEYA şifresi eşleşmiyorsa hata fırlat
    // Not: Gerçek projelerde şifreler şifrelenir (bcrypt vb.), şu an MVP için doğrudan karşılaştırıyoruz.
    if (!user || user.password !== data.password) {
      throw new UnauthorizedException('Email veya şifre hatalı!');
    }

    // 3. Giriş başarılıysa kullanıcının kimliğini (şifresi hariç) geri dön
    return {
      message: 'Giriş başarılı!',
      user: {
        id: user.id,
        email: user.email,
        role: user.role, // Frontend bu role bakıp yönlendirme yapacak
      }
    };
  }
}