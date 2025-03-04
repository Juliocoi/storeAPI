import { Store } from '../models/store';

export class CreateStoreService {
  constructor() {}

  async createStore(
    name: string,
    address: string,
    bairro: string,
    city: string,
    uf: string,
    cep: string,
    longitude: number,
    latitude: number,
  ) {
    const newStore = await Store.create({
      name,
      address,
      bairro,
      city,
      uf,
      cep,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    });

    return newStore;
  }
}
