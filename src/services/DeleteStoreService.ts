import mongoose from 'mongoose';
import { Store } from '../models/store';
import { logger } from '../config/logger';

export class DeleteStore {
  constructor() {}

  async deleteStoreById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error('DeleteStore: O formato do ID informado é inválido');
      throw new Error('Invalid ID');
    }

    const store = await Store.findByIdAndDelete(id).exec();
    return store;
  }
}
