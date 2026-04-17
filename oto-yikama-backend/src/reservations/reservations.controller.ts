import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.createReservation(createReservationDto);
  }

  @Get('user/:userId')
  getUserAppointments(@Param('userId') userId: string) {
    return this.reservationsService.getUserReservations(Number(userId));
  }

  @Get('business/:businessId')
  getBusinessAppointments(@Param('businessId') businessId: string) {
    return this.reservationsService.getBusinessReservations(Number(businessId));
  }

  @Get('available-hours')
  getAvailableHours(
    @Query('businessId') businessId: string,
    @Query('date') date: string,
  ) {
    return this.reservationsService.getAvailableHours(Number(businessId), date);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'PENDING' | 'COMPLETED' | 'CANCELED' },
  ) {
    return this.reservationsService.updateReservationStatus(
      Number(id),
      body.status,
    );
  }
}
