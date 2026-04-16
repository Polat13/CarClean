import { Controller, Post, Body , Get , Param ,Patch} from '@nestjs/common';
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
  // PATCH http://localhost:3000/services/1 (1 ID'li hizmeti günceller)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.servicesService.updateService(Number(id), updateData);
  }
}