import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './schema/Store.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Store.name, schema: StoreSchema}]),
  ],

  controllers: [],
  providers:[],
})
export class StoreModule {}
