import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './schema/Store.schema';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Store.name, schema: StoreSchema}]),
  ],

  controllers: [StoreController],
  providers:[StoreService],
})
export class StoreModule {}
