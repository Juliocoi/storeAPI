import mongoose from 'mongoose';
import { Store } from '../models/store';
import { logger } from '../config/logger';

export class StoreList {
  constructor() {}

  async listAllStores() {
    const stores = await Store.find();
    return stores;
  }

  async listStoreById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error('ListStoreServise: O formato do ID informado é inválido');
      throw new Error('Invalid ID');
    }

    const store = await Store.findById(id).exec();
    return store;
  }
}
