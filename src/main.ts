import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  //Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('StoreAPI')
    .setDescription('PB DEZ24 - Desafio 3')
    .setVersion('3.0')
    .addBearerAuth()
    .addTag('store')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
