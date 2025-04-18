export class StoreDto {
  id: string;
  name: string;
  adress: string;
  number: string;
  bairro: string;
  city: string;
  state: string;
  postalCode: string;
  storeType: string;
  location: {
    type: string;
    coordinates: number[];
  }
}