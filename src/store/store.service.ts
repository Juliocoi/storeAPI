import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Store, StoreDocument } from './schema/Store.schema';
import mongoose, { Model } from 'mongoose';
import { GoogleGeolocationService } from 'src/external-services/google-geolocation-service.service';
import { StoreResponseDto, MapPinDto } from './dto/store-response.dto';
import { MelhorEnvioService } from 'src/external-services/melhor-envio-service.service';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    private readonly googleGeolocationService: GoogleGeolocationService,
    private readonly melhorEnvioService: MelhorEnvioService
  ) { }

  async listAllStores(): Promise<Store[]> {
    const stores = await this.storeModel.find();
    return stores;
  }

  async findStoreById(id: string): Promise<Store> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const store = await this.storeModel.findById(id);
    if (!store) {
      throw new NotFoundException(`Store not found.`);
    }
    return store;
  }

  async findStoresByState(state: string): Promise<Store[]> {
    const store = await this.storeModel.find({ state: state.toUpperCase() });

    return store;
  }

  async findStoreByCep(postalCode: string): Promise<{ store: StoreResponseDto; mapPin: MapPinDto }> {
    try {
      const userAddress = await this.googleGeolocationService.getCoordinateByCep(postalCode);

      // Busca por lojas do tipo PDV
      const pdvStores = await this.storeModel.find({
        storeType: 'PDV',
        location: {
          $near: {
            $geometry: userAddress.location,
            $maxDistance: 50000, // 50km in meters 
          },
        },
      });

      // Caso tenha PDV em 50km
      if (pdvStores.length > 0) {
        const nearestPdv = pdvStores[0];

        const distance = await this.googleGeolocationService.calculateDistance(
          nearestPdv.location.coordinates as any,
          userAddress.location.coordinates,
        );

        // Formato da resposta p Tipo PDV
        const response: StoreResponseDto = {
          name: nearestPdv.name,
          city: nearestPdv.city,
          postalCode: nearestPdv.postalCode,
          type: 'PDV',
          distance,
          value: [
            {
              prazo: '1 dia útil',
              price: 'R$ 15,00',
              description: 'Motoboy',
            },
          ],
        };

        const mapPin: MapPinDto = {
          position: {
            lat: nearestPdv.location.coordinates[1],
            long: nearestPdv.location.coordinates[0],
          },
          title: nearestPdv.name,
        };

        return { store: response, mapPin };
      }
      // Caso não tenha um PDV:
      const onlineStores = await this.storeModel.find({
        storeType: 'LOJA',
        location: {
          $near: {
            $geometry: userAddress.location,
          },
        },
      });

      if (onlineStores.length === 0) {
        throw new NotFoundException('No stores found');
      }

      const nearestStore = onlineStores[0];

      const distance = await this.googleGeolocationService.calculateDistance(
        nearestStore.location.coordinates as any,
        userAddress.location.coordinates,
      );

      // Calcula as opeções de frete via Melhor Envio
      const shippingOptions = await this.melhorEnvioService.calculateShipping(
        nearestStore.postalCode,
        postalCode,
        nearestStore.shippingTimeInDays
      );

      // Formato da resposta p tipo Loja
      const response: StoreResponseDto = {
        name: nearestStore.name,
        city: nearestStore.city,
        postalCode: nearestStore.postalCode,
        type: 'online',
        distance,
        value: shippingOptions,
      };

      const mapPin: MapPinDto = {
        position: {
          lat: nearestStore.location.coordinates[1],
          long: nearestStore.location.coordinates[0],
        },
        title: nearestStore.name,
      };

      return { store: response, mapPin };
    } catch (error) {
      throw new Error(`Error finding store by CEP: ${error.message}`);
    }
  }
}
