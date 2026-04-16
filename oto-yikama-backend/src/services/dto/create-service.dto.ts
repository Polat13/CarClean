import { IsString, IsNotEmpty, IsNumber, IsInt, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty({ message: 'Hizmet adı boş bırakılamaz.' })
  name!: string; // Örn: "Detaylı İç Yıkama"

  @IsNumber({}, { message: 'Fiyat bir sayı olmalıdır.' })
  @Min(0, { message: 'Fiyat 0 veya daha büyük olmalıdır.' })
  price!: number; // Örn: 350.50

  @IsInt({ message: 'Süre tam sayı (dakika) olmalıdır.' })
  @Min(10, { message: 'Bir hizmet en az 10 dakika sürmelidir.' })
  duration!: number; // Örn: 45 (dakika)

  @IsInt()
  @IsNotEmpty()
  businessId!: number; // Bu hizmet hangi dükkana ait?
}