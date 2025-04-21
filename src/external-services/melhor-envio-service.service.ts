import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { StoreValueDto } from 'src/store/dto/store-response.dto';

@Injectable()
export class MelhorEnvioService {
  private readonly baseUrl = 'https://www.melhorenvio.com.br/api/v2';

  constructor(private readonly configService: ConfigService) { }

  async calculateShipping(
    originPostalCode: string,
    destinationPostalCode: string,
    shippingTimeInDays: number
  ): Promise<StoreValueDto[]> {
    try {
      const mockPackage = {
        height: 10,
        width: 15,
        length: 20,
        weight: 0.5,
      };

      const apiToken = this.configService.get('MELHOR_ENVIO_TOKEN');

      const response = await axios.post(
        `${this.baseUrl}/me/shipment/calculate`,
        {
          from: { postal_code: originPostalCode },
          to: { postal_code: destinationPostalCode },
          package: mockPackage,
          services: '1,2'
        },
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      // Faz o tratamendo da response para pegar os serviços de PAC e Sedex da resposta do MelhorEnvio
      if (response.data && Array.isArray(response.data)) {
        const shippingOptions: StoreValueDto[] = [];

        for (const option of response.data) {
          if (!('error' in option)) {
            const description = option.name === 'SEDEX'
              ? 'Sedex a encomenda expressa dos Correios'
              : 'PAC a encomenda economica dos Correios'

            shippingOptions.push({
              // dados necessarios
              prazo: `${option.custom_delivery_time + shippingTimeInDays} dias úteis`,
              price: `R$ ${parseFloat(option.price).toFixed(2).replace('.', ',')}`,
              description
            });
          }
        }
        return shippingOptions;
      }

      throw new Error('No shipping options available');
    } catch (error) {
      throw new Error(`Error calculating shipping: ${error.message}`);
    }
  }
}
