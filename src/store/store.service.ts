import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Store, StoreDocument } from './schema/Store.schema';
import mongoose, { Model } from 'mongoose';
import { StoreDto } from './dto/store-response.dto';
// TODO criar um response DTO para ocultar o V_ do mongoDB
@Injectable()
export class StoreService {
  constructor(@InjectModel(Store.name) private storeModel: Model<StoreDocument>){}

  async listAllStores(): Promise<Store[]> {
    const stores = await this.storeModel.find();
    return stores;
  }

  async findStoreById(id: string): Promise<Store>{
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new Error('Invalid ID format');
    }

    const store = await this.storeModel.findById(id);
    if(!store){
      throw new NotFoundException(`Store not found.`);
    }
    return store;
  }

  async findStoresByState(state: string): Promise<Store[]> {
    const store = await this.storeModel.find({ state: state.toUpperCase() });
    
    return store;
  }
}
