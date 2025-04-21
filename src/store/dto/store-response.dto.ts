/**
 * Representa os valores de serviços/produtos de uma loja
 * @class StoreValueDto
 */
export class StoreValueDto {
  /**
 * Prazo de entrega da loja
 * @example "3 dias úteis"
 */
  prazo: string;
  /**
 * Preço do produto ou serviço
 * @example "R$ 99,90"
 */
  price: string;

  /**
   * Descrição do produto ou serviço oferecido
   * @example "Entrega padrão"
   */
  description: string;
}

/**
 * Representa os dados de resposta de uma loja
 * @class StoreResponseDto
 */
export class StoreResponseDto {
  /**
   * Nome da loja
   * @example "Loja Centro"
   */
  name: string;
  /**
   * Cidade onde a loja está localizada
   * @example "São Paulo"
   */
  city: string;
  /**
   * CEP da loja
   * @example "01310-100"
   */
  postalCode: string;
  /**
   * Tipo da loja
   * @example "Física"
   * @enum ["PDV", "LOJA"]
   */

  type: string;
  /**
   * Distância em quilômetros do ponto de referência
   * @example 2.5
   */
  distance: number;
  /**
   * Lista de valores de produtos/serviços oferecidos pela loja
   * @type {StoreValueDto[]}
   */
  value: StoreValueDto[];
}

/**
 * Representa um ponto no mapa para uma loja
 * @class MapPinDto
 */
export class MapPinDto {
  /**
   * Coordenadas geográficas da loja
   * @example { lat: -23.5505, long: -46.6333 }
   */
  position: {
    /**
     * Latitude
     * @example -23.5505
     */
    lat: number;
    /**
     * Longitude
     * @example -46.6333
     */
    long: number;
  };
  /**
   * Título do ponto no mapa
   * @example "Loja Centro"
   */
  title: string;
}