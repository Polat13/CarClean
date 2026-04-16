import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Geçerli bir email adresi giriniz' })
  @IsNotEmpty({ message: 'Email boş bırakılamaz' })
  email!: string;

  @IsNotEmpty({ message: 'Şifre boş bırakılamaz' })
  password!: string;
}