import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Store, StoreDocument } from './schema/Store.schema';
import { Model } from 'mongoose';

@Injectable()
export class StoreService {
  constructor(@InjectModel(Store.name) private storeModel: Model<StoreDocument>){}

  async listAllStores(): Promise<Store[]> {
    const stores = await this.storeModel.find();
    return stores;
  }
}
