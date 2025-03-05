import axios from 'axios';

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
          q: cep,
          format: 'json',
        },
      },
    );

    if (nominatimResponse.data.length === 0) {
      throw new Error('CEP not found');
    }

    const { lon, lat } = nominatimResponse.data[0];

    return {
      longitude: parseFloat(lon),
      latitude: parseFloat(lat),
    };
  }
}
