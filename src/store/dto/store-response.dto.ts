// export class StoreDto {
//   id: string;
//   name: string;
//   adress: string;
//   number: string;
//   bairro: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   storeType: string;
//   location: {
//     type: string;
//     coordinates: number[];
//   }
// }

export class StoreValueDto {
  prazo: string;
  price: string;
  description: string;
}

export class StoreResponseDto {
  name: string;
  city: string;
  postalCode: string;
  type: string;
  distance: string;
  value: StoreValueDto[];
}

export class MapPinDto {
  position: {
    lat: string;
    long: string;
  };
  title: string;
}