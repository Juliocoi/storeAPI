import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './schema/Store.schema';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { GoogleGeolocationService } from 'src/external-services/google-geolocation-service.service';
import { MelhorEnvioService } from 'src/external-services/melhor-envio-service.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
  ],

  controllers: [StoreController],
  providers: [StoreService, GoogleGeolocationService, MelhorEnvioService],
})
export class StoreModule { }
