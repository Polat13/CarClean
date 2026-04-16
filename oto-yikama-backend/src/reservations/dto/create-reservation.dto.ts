import { IsInt, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateReservationDto {
  @IsDateString({}, { message: 'Geçerli bir tarih giriniz (Örn: 2026-05-20)' })
  @IsNotEmpty({ message: 'Tarih boş bırakılamaz' })
  date!: string;

  @IsString()
  @IsNotEmpty({ message: 'Saat boş bırakılamaz (Örn: 14:00)' })
  time!: string; 

  @IsInt()
  @IsNotEmpty()
  userId!: number; // Randevuyu alan müşteri

  @IsInt()
  @IsNotEmpty()
  businessId!: number; // Randevu alınan dükkan

  @IsInt()
  @IsNotEmpty()
  serviceId!: number; // Seçilen yıkama hizmeti
}