import { Test, TestingModule } from '@nestjs/testing';
import { GoogleGeolocationService } from './google-geolocation-service.service';

describe('GoogleGeolocationServiceService', () => {
  let service: GoogleGeolocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleGeolocationService],
    }).compile();

    service = module.get<GoogleGeolocationService>(GoogleGeolocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
