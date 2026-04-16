import { Controller, Post, Body , Get ,Patch ,Param} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';

@Controller('business') // http://localhost:3000/business
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessService.createBusiness(createBusinessDto);
  }
  @Get()
  findAll() {
    return this.businessService.getAllBusinesses();
  }
  // PATCH http://localhost:3000/business/1 (1 ID'li işletmeyi günceller)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.businessService.updateBusiness(Number(id), updateData);
  }
}