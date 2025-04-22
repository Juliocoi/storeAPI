import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import axios from 'axios';
import { MelhorEnvioService } from './melhor-envio-service.service';

// Mock do axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MelhorEnvioService', () => {
  let service: MelhorEnvioService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MelhorEnvioService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'MELHOR_ENVIO_TOKEN') return 'fake-token';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MelhorEnvioService>(MelhorEnvioService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateShipping', () => {
    it('should return shipping options when valid postal codes are provided', async () => {
      // Arrange
      const originPostalCode = '01001000'; // São Paulo
      const destinationPostalCode = '20010000'; // Rio de Janeiro
      const shippingTimeInDays = 2;

      const mockResponse = {
        data: [
          {
            id: 1,
            name: 'SEDEX',
            price: '25.50',
            custom_delivery_time: 1
          },
          {
            id: 2,
            name: 'PAC',
            price: '15.75',
            custom_delivery_time: 3
          }
        ]
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await service.calculateShipping(
        originPostalCode,
        destinationPostalCode,
        shippingTimeInDays
      );

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].price).toBe('R$ 25,50');
      expect(result[0].prazo).toBe('3 dias úteis'); // 1 + 2 dias
      expect(result[1].price).toBe('R$ 15,75');
      expect(result[1].prazo).toBe('5 dias úteis'); // 3 + 2 dias

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/me/shipment/calculate'),
        expect.objectContaining({
          from: { postal_code: originPostalCode },
          to: { postal_code: destinationPostalCode }
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer fake-token'
          })
        })
      );
    });

    it('should throw HttpException when API token is not configured', async () => {
      // Arrange
      const originPostalCode = '01001000';
      const destinationPostalCode = '20010000';
      const shippingTimeInDays = 2;

      // Mock the config service to return null for the token
      jest.spyOn(configService, 'get').mockReturnValueOnce(null);

      // Act & Assert
      await expect(
        service.calculateShipping(
          originPostalCode,
          destinationPostalCode,
          shippingTimeInDays
        )
      ).rejects.toThrow(HttpException);

      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it('should throw HttpException when API returns error response', async () => {
      // Arrange
      const originPostalCode = '01001000';
      const destinationPostalCode = '20010000';
      const shippingTimeInDays = 2;

      // Simulate API returning an error
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 422,
          data: { message: 'Validation error' }
        },
        isAxiosError: true
      });

      // Act & Assert
      await expect(
        service.calculateShipping(
          originPostalCode,
          destinationPostalCode,
          shippingTimeInDays
        )
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException when no shipping options are available', async () => {
      // Arrange
      const originPostalCode = '01001000';
      const destinationPostalCode = '20010000';
      const shippingTimeInDays = 2;

      // API returns empty array
      mockedAxios.post.mockResolvedValueOnce({
        data: []
      });

      // Act & Assert
      await expect(
        service.calculateShipping(
          originPostalCode,
          destinationPostalCode,
          shippingTimeInDays
        )
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException when API returns only error options', async () => {
      // Arrange
      const originPostalCode = '01001000';
      const destinationPostalCode = '20010000';
      const shippingTimeInDays = 2;

      // API returns only error options
      mockedAxios.post.mockResolvedValueOnce({
        data: [
          { error: 'Service unavailable for this route' },
          { error: 'Another error' }
        ]
      });

      // Act & Assert
      await expect(
        service.calculateShipping(
          originPostalCode,
          destinationPostalCode,
          shippingTimeInDays
        )
      ).rejects.toThrow(HttpException);
    });

    it('should throw HttpException when connection to API fails', async () => {
      // Arrange
      const originPostalCode = '01001000';
      const destinationPostalCode = '20010000';
      const shippingTimeInDays = 2;

      // Simulate network error
      mockedAxios.post.mockRejectedValueOnce({
        code: 'ECONNREFUSED',
        isAxiosError: true
      });

      // Act & Assert
      await expect(
        service.calculateShipping(
          originPostalCode,
          destinationPostalCode,
          shippingTimeInDays
        )
      ).rejects.toThrow(HttpException);
    });
  });
});
