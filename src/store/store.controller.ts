import { Controller, Get, Param } from '@nestjs/common';
import { StoreService } from './store.service';
//TODO refatorar: Ver como retornar status code, melhorar tratamento de erros, add swagger
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

  @Get(':id')
  async listStoreByID(@Param('id') id: string) {
    try {
      const store = await this.storeService.findStoreById(id);
      return store;
      
    } catch(err){
      throw err;
    }
  }
}
