import { Request } from 'express';
import mongoose from 'mongoose';
import { Store } from '../models/store';

export class UpdateStore {
  constructor() {}

  async updateStoreById(id: string, reqBody: Request) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID');
    }

    const store = await Store.findByIdAndUpdate(id, reqBody, {
      new: true,
      runValidators: true,
    });

    return store;
  }
}
