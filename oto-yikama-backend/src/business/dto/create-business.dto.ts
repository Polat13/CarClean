import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty({ message: 'İşletme adı boş olamaz' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Adres boş olamaz' })
  address!: string;

  @IsInt()
  @IsNotEmpty()
  userId!: number;

  @IsString()
  @IsOptional()
  @Matches(/^\d{11}$/, {
    message: 'Telefon numarası 11 haneli olmalıdır',
  })
  phone?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsInt()
  @IsNotEmpty({ message: 'Açılış saati boş olamaz' })
  openTime!: number;

  @IsInt()
  @IsNotEmpty({ message: 'Kapanış saati boş olamaz' })
  closeTime!: number;
}
