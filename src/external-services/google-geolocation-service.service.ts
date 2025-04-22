import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

interface IAdressResponse {
  location: {
    type: string,
    coordinates: [number, number]
  }
}

@Injectable()
export class GoogleGeolocationService {
  private readonly baseUrl = 'https://maps.googleapis.com/maps/api';

  constructor(private readonly configService: ConfigService) { }

  async getCoordinateByCep(postalCode: string): Promise<IAdressResponse> {
    try {
      //Validação do CEP
      const onlyNumberCep = postalCode.replace(/\D/g, ''); // Retira espaços, letras e caracteres especiais
      const cepFormatValidation = /^[0-9]{8}$/; // valida se o cep possui 8 dígitos entre 0 e 9

      if (!cepFormatValidation.test(onlyNumberCep)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'O CEP deve conter 8 dígitos numéricos',
            error: 'CEP_INVALIDO'
          },
          HttpStatus.BAD_REQUEST
        );
      }

      const apiKey = this.configService.get<string>('GOOGLE_APIKEY');
      if (!apiKey) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Chave da API Google não configurada',
            error: 'CONFIG_ERROR'
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      const googleResponse = await axios.get(`${this.baseUrl}/geocode/json`, {
        params: {
          address: postalCode,
          key: apiKey
        }
      });

      // o status ok indica sucesso e que pelo menos um endereço foi encontrado.
      if (googleResponse.data.status === 'OK') {
        const { geometry } = googleResponse.data.results[0];
        return {
          location: {
            type: 'Point',
            coordinates: [geometry.location.lng, geometry.location.lat], // [longitude, latitude]
          }
        };
      } else if (googleResponse.data.status === 'ZERO_RESULTS') {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Não foi encontrado nenhum endereço para o CEP ${postalCode}`,
            error: 'ENDERECO_NAO_ENCONTRADO'
          },
          HttpStatus.NOT_FOUND
        );
      } else {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_GATEWAY,
            message: `Erro na API Google: ${googleResponse.data.status}`,
            error: 'API_GOOGLE_ERRO'
          },
          HttpStatus.BAD_GATEWAY
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // Erro genérico - pode ser problema de rede ou outro, desde q ñ seja um HttpException
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Erro ao buscar endereço: ${error.message}`,
          error: 'ERRO_INTERNO'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
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
      if (!apiKey) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Chave da API Google não configurada',
            error: 'CONFIG_ERROR'
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      const response = await axios.get(
        `${this.baseUrl}/distancematrix/json`,
        {
          params: {
            origins: originStr,
            destinations: destStr,
            key: apiKey
          }
        }
      ); //default=driveing
      // Processamento da resposta da API distancematrix(Google)
      const status = response.data.status;

      if (status === 'OK' && response.data.rows.length > 0) {
        const elementStatus = response.data.rows[0].elements[0].status;

        if (elementStatus === 'OK') {
          // Converte a distância de metros para KM
          const distanceInMeters = response.data.rows[0].elements[0].distance.value;
          return parseFloat((distanceInMeters / 1000).toFixed(6));
        } else if (elementStatus === 'NOT_FOUND') {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'A origem e/ou destino não puderam ser geocodificados',
              error: 'GEOCODIFICACAO_FALHOU'
            },
            HttpStatus.BAD_REQUEST
          );
        } else if (elementStatus === 'ZERO_RESULTS') {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Não foi possível encontrar uma rota entre a origem e o destino',
              error: 'ROTA_NAO_ENCONTRADA'
            },
            HttpStatus.BAD_REQUEST
          );
        } else {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: `Erro no cálculo da rota: ${elementStatus}`,
              error: 'CALCULO_ROTA_FALHOU'
            },
            HttpStatus.BAD_REQUEST
          );
        }
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_GATEWAY,
          message: `Erro na API Distance Matrix: ${status}`,
          error: 'API_GOOGLE_ERRO'
        },
        HttpStatus.BAD_GATEWAY
      );
    } catch (error) {
      // Se já for um HttpException, apenas repassa
      if (error instanceof HttpException) {
        throw error;
      }

      // Erro com axios 
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          throw new HttpException(
            {
              statusCode: HttpStatus.SERVICE_UNAVAILABLE,
              message: 'Não foi possível conectar ao serviço do Google Maps',
              error: 'SERVICO_INDISPONIVEL'
            },
            HttpStatus.SERVICE_UNAVAILABLE
          );
        }
      }

      // Erro genérico
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Erro ao calcular distância: ${error.message}`,
          error: 'ERRO_INTERNO'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
