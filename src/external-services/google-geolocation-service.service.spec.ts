import { Test, TestingModule } from '@nestjs/testing';
import { GoogleGeolocationServiceService } from './google-geolocation-service.service';

describe('GoogleGeolocationServiceService', () => {
  let service: GoogleGeolocationServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleGeolocationServiceService],
    }).compile();

    service = module.get<GoogleGeolocationServiceService>(GoogleGeolocationServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
