import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type StoreDocument = Store & Document;

@Schema()
export class Store {
  @Prop({ required: [true, "Name required."], trim: true })
  name: string;

  @Prop({ required: [true, "Address required"], trim: true })
  address: string;

  @Prop({ required: true, trim: true })
  number: string;

  @Prop({ required: true, trim: true })
  bairro: string;

  @Prop({ required: [true, "City is required"], trim: true })
  city: string;

  @Prop({ required: [true, "UF is required"], trim: true })
  state: string;

  @Prop({ required: [true, "CEP required"], trim: true })
  postalCode: string;

  @Prop({
    required: [true, "Store type is required (PDV|LOJA)"],
    enum: ["PDV", "LOJA"],
    default: "LOJA",
  })
  storeType: string;

  @Prop({
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: string;
    coordinates: { type: [Number]; required: true }; // [longitude, latitude]
  };
}
export const StoreSchema = SchemaFactory.createForClass(Store);
StoreSchema.index({ location: "2dsphere" });
