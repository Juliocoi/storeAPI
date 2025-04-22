import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './exceptions/exception.filter';
import { StoreModule } from './store/store.module';
import { GoogleGeolocationService } from './external-services/google-geolocation-service.service';
import { MelhorEnvioService } from './external-services/melhor-envio-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DATABASE'),
      }),
    }),
    StoreModule,
  ],
  controllers: [],
  providers: [
    GoogleGeolocationService,
    MelhorEnvioService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    }
  ],
})
export class AppModule { }
