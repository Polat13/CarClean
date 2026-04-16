import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // FRONTEND BAĞLANTISI İÇİN CORS İZNİ (Bunu ekledik)
  app.enableCors({
    origin: '*', // Geliştirme aşamasında her yerden gelen isteği kabul et
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3001);
}
bootstrap();