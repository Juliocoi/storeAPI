import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
      if (!apiToken) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Token da API Melhor Envio não configurado',
            error: 'CONFIG_ERROR'
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

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

      // Verificação da resposta
      if (!response.data || !Array.isArray(response.data)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_GATEWAY,
            message: 'Formato de resposta inválido da API Melhor Envio',
            error: 'API_RESPOSTA_INVALIDA'
          },
          HttpStatus.BAD_GATEWAY
        );
      }

      // Faz o tratamendo da response para pegar os serviços de PAC e Sedex da resposta do MelhorEnvio
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

      if (shippingOptions.length === 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Nenhuma opção de envio disponível para os CEPs informados',
            error: 'OPCOES_ENVIO_NAO_ENCONTRADAS'
          },
          HttpStatus.NOT_FOUND
        );
      }

      return shippingOptions;
    } catch (error) {
      // Se já for um HttpException, apenas repassa
      if (error instanceof HttpException) {
        throw error;
      }

      // Tratamento para erros específicos do Axios
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          throw new HttpException(
            {
              statusCode: HttpStatus.SERVICE_UNAVAILABLE,
              message: 'Não foi possível conectar ao serviço Melhor Envio',
              error: 'SERVICO_INDISPONIVEL'
            },
            HttpStatus.SERVICE_UNAVAILABLE
          );
        }

        // Erros de resposta da API
        if (error.response) {
          const status = error.response.status;
          let message = 'Erro na comunicação com a API Melhor Envio';
          let errorType = 'API_MELHOR_ENVIO_ERRO';

          // Erros específicos baseados no status
          if (status === 401 || status === 403) {
            message = 'Erro de autenticação com a API Melhor Envio';
            errorType = 'API_AUTENTICACAO_ERRO';
          } else if (status === 404) {
            message = 'Recurso não encontrado na API Melhor Envio';
            errorType = 'API_RECURSO_NAO_ENCONTRADO';
          } else if (status === 422) {
            message = 'Dados inválidos enviados para a API Melhor Envio';
            errorType = 'API_DADOS_INVALIDOS';
          }

          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_GATEWAY,
              message,
              error: errorType
            },
            HttpStatus.BAD_GATEWAY
          );
        }
      }

      // Erro genérico
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Erro ao calcular frete: ${error.message}`,
          error: 'ERRO_CALCULO_FRETE'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
