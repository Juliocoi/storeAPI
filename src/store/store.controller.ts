import { Controller, Get, Param, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

/**
 * Controlador para gerenciamento de lojas
 * @class StoreController
 */
@ApiTags('store')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) { }
  /**
   * Lista lojas com base nos parâmetros de consulta fornecidos.
   * Suporta três comportamentos diferentes:
   * 1. Sem parâmetros: lista todas as lojas
   * 2. Com parâmetro state: filtra lojas por estado
   * 3. Com parâmetro postalCode: filtra lojas por CEP
   * 
   * @summary Lista todas as lojas ou filtra por estado ou CEP
   */
  @Get()
  @ApiQuery({ name: 'state', required: false, description: 'Filtrar lojas por estado (opcional)' })
  @ApiQuery({ name: 'postalCode', required: false, description: 'Filtrar lojas por CEP no formato 52210240 (opcional)' })
  async list(
    @Query('state') state: string,
    @Query('postalCode') postalCode: string
  ) {
    try {
      if (state)
        return await this.storeService.findStoresByState(state);
      if (postalCode)
        return await this.storeService.findStoreByCep(postalCode);

      return await this.storeService.listAllStores();
    } catch (err) {
      throw err;
    }
  }

  /**
 * Busca uma loja específica pelo seu ID
 * @summary Busca uma loja pelo ID
 * @param {string} id - ID da loja
 * @returns {Promise<any>} Dados da loja
 * @throws {Error} Loja não encontrada ou erro na consulta
 */
  @Get(':id')
  async listStoreByID(@Param('id') id: string) {
    try {
      const store = await this.storeService.findStoreById(id);
      return store;
    } catch (err) {
      throw err;
    }
  }
}
