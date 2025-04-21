import { Test, TestingModule } from '@nestjs/testing';
import { MelhorEnvioService } from './melhor-envio-service.service';

describe('MelhorEnvioServiceService', () => {
  let service: MelhorEnvioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MelhorEnvioService],
    }).compile();

    service = module.get<MelhorEnvioService>(MelhorEnvioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
