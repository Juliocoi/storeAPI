import mongoose from 'mongoose';
import { Store } from '../models/store';

export class StoreList {
  constructor() {}

  async listAllStores() {
    const stores = await Store.find();
    return stores;
  }

  async listStoreById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID');
    }

    const store = await Store.findById(id).exec();
    return store;
  }
}
