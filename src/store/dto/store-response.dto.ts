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
  distance: number;
  value: StoreValueDto[];
}

export class MapPinDto {
  position: {
    lat: number;
    long: number;
  };
  title: string;
}