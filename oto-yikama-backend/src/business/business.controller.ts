import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessService.createBusiness(createBusinessDto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 1024 * 1024 * 2 },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Dosya bulunamadı.');
    }

    return { url: `http://localhost:3001/uploads/${file.filename}` };
  }

  @Get()
  findAll() {
    return this.businessService.getAllBusinesses();
  }

  @Get('owner/:userId')
  async findByOwner(@Param('userId') userId: string) {
    const business = await this.businessService.getBusinessByOwnerId(
      Number(userId),
    );

    if (!business) {
      throw new NotFoundException('İşletme bulunamadı.');
    }

    return business;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const business = await this.businessService.getBusinessById(Number(id));

    if (!business) {
      throw new NotFoundException('İşletme bulunamadı.');
    }

    return business;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Prisma.BusinessUpdateInput,
  ) {
    return this.businessService.updateBusiness(Number(id), updateData);
  }
}
