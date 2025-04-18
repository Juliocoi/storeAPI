import { Controller, Get, Param, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreDto } from './dto/store-response.dto';
//TODO refatorar: Ver como retornar status code, melhorar tratamento de erros, add swagger
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}
  
  @Get()
  async list(@Query('state') state: string) {
    try {
      return state 
        ? await this.storeService.findStoresByState(state)
        : await this.storeService.listAllStores();
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
