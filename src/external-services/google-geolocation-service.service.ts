import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

interface IAdressResponse {
  address: string;
  location: {
    type: string,
    coordinates: [number, number]
  }
}

// interface IMApPin {
//   position: {
//     lat: number;
//     lng: number
//   };
//   title: string;
// }


@Injectable()
export class GoogleGeolocationServiceService {
  private readonly baseUrl = 'https://maps.googleapis.com/maps/api';

  constructor(private readonly configService: ConfigService) { }

  async getCoordinateByCep(postalCode: string): Promise<IAdressResponse> {
    try {
      const onlyNumberCep = postalCode.replace(/\D/g, ''); // Retira espaços, letras e caracteres especiais

      const cepFormatValidation = /^[0-9]{8}$/; // valida se o cep possui 8 dígitos entre 0 e 9

      if (!cepFormatValidation.test(onlyNumberCep)) {
        throw new Error('The format of postal code is invalid');
      }

      const apiKey = this.configService.get<string>('GOOGLE_APIKEY');

      const googleResponse = await axios.get(`${this.baseUrl}/geocode/json`, {
        params: {
          adress: postalCode,
          key: apiKey
        }
      });
      // o status ok indica sucesso e que pelo menos um endereço foi encontrado.
      if (googleResponse.data.status === 'OK') {
        const { formatted_address, geometry } = googleResponse.data.results[0];

        return {
          address: formatted_address,
          location: {
            type: 'Point',
            coordinates: [geometry.location.lng, geometry.location.lat], // [longitude, latitude]
          }
        };
      }

      throw new Error('Address not found');
    } catch (error) {
      throw new Error(`Error getting address from Google API: ${error.message}`);
    }
  }

  async calculateDistance(
    origin: [number, number],
    destination: [number, number],
  ): Promise<number> {
    try {
      const originStr = `${origin[1]},${origin[0]}`; // ATENÇÃO lat,lng ordem inversa ao armazenado no mongoDB e retorno da função getAddressByCep
      const destStr = `${destination[1]},${destination[0]}`; // ATENÇÃO lat,lng

      const apiKey = this.configService.get<string>('GOOGLE_APIKEY');

      const response = await axios.get(
        `${this.baseUrl}/distancematrix/json?origins=${originStr}&destinations=${destStr}&key=${apiKey}`,
      ); //default=driveing
      // TODO Remover comentário https://maps.googleapis.com/maps/api/distancematrix/json?origins=-8.11199,-34.91093&destinations=-8.021630399999999,-34.909481&units=imperial&key=AIzaSyDGf9IFEEtUQ6P7YH0zpIngFoFeoLoIXq8

      const { responseStats = response.data.status, responseDataRow = response.data.rows.length, responseDataRowElementsStatus = response.data.rows[0].elements[0].status } = response.data;

      if (
        responseStats === 'OK' &&
        responseDataRow > 0 &&
        responseDataRowElementsStatus === 'OK'
      ) {
        // Convert distance from meters to kilometers and round to 6 decimal places
        const distanceInMeters = response.data.rows[0].elements[0].distance.value;

        return parseFloat((distanceInMeters / 1000).toFixed(6));

      } else if (
        responseStats === 'OK' &&
        responseDataRowElementsStatus === 'NOT_FOUND'
      ) {
        throw new Error('the origin and/or destination of this pairing could not be geocoded');

      } else if (
        responseStats === 'OK' &&
        responseDataRowElementsStatus === 'ZERO_RESULTS'
      ) {
        throw new Error('no route could be found between the origin and destination');
      }

      throw new Error('Unable to calculate distance');
    } catch (error) {
      throw new Error(`Error calculating distance: ${error.message}`);
    }
  }
}
