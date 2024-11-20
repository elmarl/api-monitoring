import { Test, TestingModule } from '@nestjs/testing';
import { UsageController } from './usage.controller';
import { UsageService } from './usage.service';
import { CreateUsageDto } from './dto/create-usage.dto';
import { UnauthorizedException } from '@nestjs/common';
import { ApiKeysService } from '../api-keys/api-keys.service';
import { ApiKeyGuard } from '../auth/api-key.guard';

describe('UsageController', () => {
  let controller: UsageController;
  let service: UsageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsageController],
      providers: [
        {
          provide: UsageService,
          useValue: {
            logUsage: jest.fn(),
          },
        },
        {
          provide: ApiKeysService,
          useValue: {
            findByKey: jest
              .fn()
              .mockResolvedValue({ user: { id: 'test-user-id' } }),
          },
        },
      ],
    })
      .overrideGuard(ApiKeyGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true), // Mock guard behavior
      })
      .compile();

    controller = module.get<UsageController>(UsageController);
    service = module.get<UsageService>(UsageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('logUsage', () => {
    it('should log usage data successfully', async () => {
      const createUsageDto: CreateUsageDto = {
        method: 'GET',
        endpoint: '/api/test',
        statusCode: 200,
        responseTime: 150,
        timestamp: new Date().toISOString(),
      };
      const apiKey = 'valid-api-key';

      (service.logUsage as jest.Mock).mockResolvedValue(undefined);

      const result = await controller.logUsage(
        createUsageDto,
        `Bearer ${apiKey}`,
      );

      expect(service.logUsage).toHaveBeenCalledWith(apiKey, createUsageDto);
      expect(result).toEqual({ message: 'Usage logged successfully' });
    });

    it('should throw UnauthorizedException if Authorization header is missing', async () => {
      const createUsageDto: CreateUsageDto = {
        method: 'GET',
        endpoint: '/api/test',
        statusCode: 200,
        responseTime: 150,
        timestamp: new Date().toISOString(),
      };

      await expect(controller.logUsage(createUsageDto, '')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if Authorization header is invalid', async () => {
      const createUsageDto: CreateUsageDto = {
        method: 'GET',
        endpoint: '/api/test',
        statusCode: 200,
        responseTime: 150,
        timestamp: new Date().toISOString(),
      };

      await expect(
        controller.logUsage(createUsageDto, 'InvalidHeader'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
