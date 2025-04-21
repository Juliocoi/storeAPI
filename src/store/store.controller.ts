import { Controller, Get, Param, Query } from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) { }

  @Get()
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
