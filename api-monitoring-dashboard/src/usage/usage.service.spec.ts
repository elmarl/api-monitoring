import { Test, TestingModule } from '@nestjs/testing';
import { UsageService } from './usage.service';
import { ApiKeysService } from '../api-keys/api-keys.service';
import { RedisService } from '../redis/redis.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usage } from './usage.entity';

describe('UsageService', () => {
  let service: UsageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Usage),
          useClass: Repository, // Mock TypeORM repository for Usage
        },
        {
          provide: ApiKeysService,
          useValue: {
            findByKey: jest
              .fn()
              .mockResolvedValue({ user: { id: 'test-user-id' } }), // Mock API key validation
          },
        },
        {
          provide: RedisService,
          useValue: {
            publish: jest.fn().mockResolvedValue(null), // Mock Redis publish method
          },
        },
        UsageService,
      ],
    }).compile();

    service = module.get<UsageService>(UsageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
