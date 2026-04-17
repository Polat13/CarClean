import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Controller('services') // http://localhost:3000/services
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.createService(createServiceDto);
  }
  @Get('business/:businessId')
  findByBusiness(@Param('businessId') businessId: string) {
    return this.servicesService.getServicesByBusiness(Number(businessId));
  }
  // PATCH http://localhost:3001/services/1 (1 ID'li hizmeti günceller)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.servicesService.updateService(Number(id), updateData);
  }

  // DELETE http://localhost:3001/services/1 (1 ID'li hizmeti siler)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.deleteService(Number(id));
  }
}