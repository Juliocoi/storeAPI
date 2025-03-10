import axios from 'axios';
import { logger } from '../config/logger';

interface Coordinates {
  longitude: number;
  latitude: number;
}

export class SearchCEP {
  constructor() {}

  async getCoordinateByCep(cep: string): Promise<Coordinates> {
    const nominatimResponse = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          postalcode: cep,
          country: 'Brazil',
          format: 'json',
        },
      },
    );
    //Caso o cep passado seja fora do Brasil ou inexistente.
    if (nominatimResponse.data.length === 0) {
      logger.warn(
        'SearchCEPService: Cep não encontrado: cep estrangeiro ou inexistente',
      );

      throw new Error('CEP not found');
    }

    const { lon, lat } = nominatimResponse.data[0];

    return {
      longitude: parseFloat(lon),
      latitude: parseFloat(lat),
    };
  }
}
