import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // POST http://localhost:3000/reservations (Randevu Oluştur)
  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.createReservation(createReservationDto);
  }

  // GET http://localhost:3000/reservations/user/1 (Müşteri Randevuları)
  @Get('user/:userId')
  getUserAppointments(@Param('userId') userId: string) {
    return this.reservationsService.getUserReservations(Number(userId));
  }

  // GET http://localhost:3000/reservations/business/1 (Dükkanın Randevuları)
  @Get('business/:businessId')
  getBusinessAppointments(@Param('businessId') businessId: string) {
    return this.reservationsService.getBusinessReservations(Number(businessId));
  }

  // GET http://localhost:3000/reservations/available-hours?businessId=1&date=2026-05-20 (Boş Saatler)
  @Get('available-hours')
  getAvailableHours(
    @Query('businessId') businessId: string,
    @Query('date') date: string,
  ) {
    return this.reservationsService.getAvailableHours(Number(businessId), date);
  }
}