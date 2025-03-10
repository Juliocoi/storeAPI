import { Request } from 'express';
import mongoose from 'mongoose';
import { Store } from '../models/store';
import { logger } from '../config/logger';

export class UpdateStore {
  constructor() {}

  async updateStoreById(id: string, reqBody: Request) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error('UpdateStore: O formato do ID informado é inválido');

      throw new Error('Invalid ID');
    }

    const store = await Store.findByIdAndUpdate(id, reqBody, {
      new: true,
      runValidators: true,
    });

    return store;
  }
}
