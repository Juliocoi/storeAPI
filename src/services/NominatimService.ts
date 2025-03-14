import axios from 'axios';
import { logger } from '../config/logger';

interface Coordinates {
  longitude: number;
  latitude: number;
}

export class SearchAdress {
  constructor() {}

  async getCoordinateByAdress(
    street: string,
    city: string,
    state: string,
  ): Promise<Coordinates> {
    const nominatimResponse = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          street: street,
          city: city,
          state: state,
          country: 'Brazil',
          format: 'json',
          limit: 1,
        },
      },
    );

    const { lon, lat } = nominatimResponse.data[0];

    return {
      longitude: parseFloat(lon),
      latitude: parseFloat(lat),
    };
  }
}
