// google-geolocation.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import axios from 'axios';
import { GoogleGeolocationService } from './google-geolocation-service.service';

// Mock do axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GoogleGeolocationService', () => {
  let service: GoogleGeolocationService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleGeolocationService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'GOOGLE_APIKEY') return 'fake-api-key';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<GoogleGeolocationService>(GoogleGeolocationService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCoordinateByCep', () => {
    it('should return address coordinates when valid CEP provided', async () => {
      // Arrange
      const validCep = '01001000';
      const mockGoogleResponse = {
        data: {
          status: 'OK',
          results: [
            {
              formatted_address: 'Praça da Sé, São Paulo - SP, Brasil',
              geometry: {
                location: {
                  lat: -23.550520,
                  lng: -46.633309
                }
              }
            }
          ]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockGoogleResponse);

      // Act
      const result = await service.getCoordinateByCep(validCep);

      // Assert
      expect(result).toEqual({
        location: {
          type: 'Point',
          coordinates: [-46.633309, -23.550520]
        }
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/geocode/json'),
        expect.objectContaining({
          params: {
            address: validCep,
            key: 'fake-api-key'
          }
        })
      );
    });

    it('should throw HttpException when invalid CEP format provided', async () => {
      // Arrange
      const invalidCep = '123456';

      // Act & Assert
      await expect(service.getCoordinateByCep(invalidCep)).rejects.toThrow(HttpException);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should throw HttpException when CEP not found', async () => {
      // Arrange
      const notFoundCep = '99999999';
      const mockGoogleResponse = {
        data: {
          status: 'ZERO_RESULTS',
          results: []
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockGoogleResponse);

      // Act & Assert
      await expect(service.getCoordinateByCep(notFoundCep)).rejects.toThrow(HttpException);
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    it('should throw HttpException when Google API returns error status', async () => {
      // Arrange
      const validCep = '01001000';
      const mockGoogleResponse = {
        data: {
          status: 'REQUEST_DENIED',
          error_message: 'API key is invalid'
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockGoogleResponse);

      // Act & Assert
      await expect(service.getCoordinateByCep(validCep)).rejects.toThrow(HttpException);
    });

    it('should throw HttpException when API key is not configured', async () => {
      // Arrange
      const validCep = '01001000';

      // Mock the config service to return null for the API key
      jest.spyOn(configService, 'get').mockReturnValueOnce(null);

      // Act & Assert
      await expect(service.getCoordinateByCep(validCep)).rejects.toThrow(HttpException);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should throw HttpException when network error occurs', async () => {
      // Arrange
      const validCep = '01001000';

      mockedAxios.get.mockRejectedValueOnce({
        code: 'ECONNREFUSED',
        isAxiosError: true
      });

      // Act & Assert
      await expect(service.getCoordinateByCep(validCep)).rejects.toThrow(HttpException);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance correctly between two coordinates', async () => {
      // Arrange
      const origin: [number, number] = [-46.633309, -23.550520]; // long, lat
      const destination: [number, number] = [-46.669838, -23.588946]; // long, lat

      const mockResponse = {
        data: {
          status: 'OK',
          rows: [
            {
              elements: [
                {
                  status: 'OK',
                  distance: {
                    value: 7500, // 7.5 km in meters
                    text: '7.5 km'
                  }
                }
              ]
            }
          ]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await service.calculateDistance(origin, destination);

      // Assert
      expect(result).toBe(7.5); // 7500m = 7.5km
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/distancematrix/json'),
        expect.objectContaining({
          params: expect.anything()
        })
      );
    });

    it('should throw HttpException when origin and destination cannot be geocoded', async () => {
      // Arrange
      const origin: [number, number] = [-46.633309, -23.550520];
      const destination: [number, number] = [-46.669838, -23.588946];

      const mockResponse = {
        data: {
          status: 'OK',
          rows: [
            {
              elements: [
                {
                  status: 'NOT_FOUND'
                }
              ]
            }
          ]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // Act & Assert
      await expect(service.calculateDistance(origin, destination)).rejects.toThrow(HttpException);
    });

    it('should throw HttpException when no route is found between points', async () => {
      // Arrange
      const origin: [number, number] = [-46.633309, -23.550520];
      const destination: [number, number] = [-46.669838, -23.588946];

      const mockResponse = {
        data: {
          status: 'OK',
          rows: [
            {
              elements: [
                {
                  status: 'ZERO_RESULTS'
                }
              ]
            }
          ]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // Act & Assert
      await expect(service.calculateDistance(origin, destination)).rejects.toThrow(HttpException);
    });

    it('should throw HttpException when API returns error status', async () => {
      // Arrange
      const origin: [number, number] = [-46.633309, -23.550520];
      const destination: [number, number] = [-46.669838, -23.588946];

      const mockResponse = {
        data: {
          status: 'REQUEST_DENIED',
          error_message: 'API key is invalid'
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // Act & Assert
      await expect(service.calculateDistance(origin, destination)).rejects.toThrow(HttpException);
    });
  });
});
