import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty({ message: 'İşletme adı boş olamaz' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Adres boş olamaz' })
  address!: string;

  @IsInt()
  @IsNotEmpty()
  userId!: number; // Bu dükkan hangi kullanıcıya ait?

  @IsInt()
  @IsNotEmpty({ message: 'Açılış saati boş olamaz' })
  openTime!: number; // Örn: 9

  @IsInt()
  @IsNotEmpty({ message: 'Kapanış saati boş olamaz' })
  closeTime!: number; // Örn: 18
}