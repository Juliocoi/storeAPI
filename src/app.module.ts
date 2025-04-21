import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  controllers: [AppController],
  providers: [AppService, GoogleGeolocationService, MelhorEnvioService],
})
export class AppModule { }
