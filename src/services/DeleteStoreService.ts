import mongoose from 'mongoose';
import { Store } from '../models/store';

export class DeleteStore {
  constructor() {}

  async deleteStoreById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID');
    }

    const store = await Store.findByIdAndDelete(id).exec();
    return store;
  }
}
