import { Controller, Get } from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}
  
  @Get()
  async listAll() {
    try {
      const storeList = await this.storeService.listAllStores();
      return storeList;
    } catch (err) {
      throw err;
    }
  }
}
