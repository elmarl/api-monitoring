import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeysService } from './api-keys.service';
import { Repository } from 'typeorm';
import { ApiKey } from './api-key.entity';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('ApiKeysService', () => {
  let service: ApiKeysService;
  let apiKeyRepository: Repository<ApiKey>;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeysService,
        {
          provide: getRepositoryToken(ApiKey),
          useClass: Repository,
        },
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ApiKeysService>(ApiKeysService);
    apiKeyRepository = module.get<Repository<ApiKey>>(
      getRepositoryToken(ApiKey),
    );
    usersService = module.get<UsersService>(UsersService);
  });

  beforeEach(() => {
    // Ensure `uuidv4` generates a predictable value during the test
    (uuidv4 as jest.Mock).mockReturnValue('generated-api-key');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateApiKey', () => {
    it('should generate and save a new API key for a valid user', async () => {
      const userId = 'user-uuid';
      const user = { id: userId, email: 'test@example.com', name: 'Test User' };
      const apiKey = {
        id: 'api-key-uuid',
        key: 'generated-api-key',
        user,
        isActive: true,
      };

      (usersService.findById as jest.Mock).mockResolvedValue(user);
      jest.spyOn(apiKeyRepository, 'create').mockReturnValue(apiKey as any);
      jest.spyOn(apiKeyRepository, 'save').mockResolvedValue(apiKey as any);

      const result = await service.generateApiKey(userId);

      expect(usersService.findById).toHaveBeenCalledWith(userId);
      expect(apiKeyRepository.create).toHaveBeenCalledWith({
        key: 'generated-api-key',
        user,
      });
      expect(apiKeyRepository.save).toHaveBeenCalledWith(apiKey);
      expect(result).toEqual(apiKey);
    });

    it('should throw BadRequestException if user not found', async () => {
      const userId = 'nonexistent-user';
      (usersService.findById as jest.Mock).mockResolvedValue(undefined);

      await expect(service.generateApiKey(userId)).rejects.toThrow(
        BadRequestException,
      );
      expect(usersService.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('listApiKeys', () => {
    it('should return a list of active API keys for a user', async () => {
      const userId = 'user-uuid';
      const apiKeys = [
        { id: 'api-key-1', key: 'key1', createdAt: new Date(), isActive: true },
        { id: 'api-key-2', key: 'key2', createdAt: new Date(), isActive: true },
      ];

      jest.spyOn(apiKeyRepository, 'find').mockResolvedValue(apiKeys as any);

      const result = await service.listApiKeys(userId);

      expect(apiKeyRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId }, isActive: true },
      });
      expect(result).toEqual(apiKeys);
    });
  });

  describe('revokeApiKey', () => {
    it('should revoke an active API key for a user', async () => {
      const userId = 'user-uuid';
      const apiKeyId = 'api-key-uuid';
      const apiKey = {
        id: apiKeyId,
        key: 'key1',
        user: { id: userId },
        isActive: true,
        save: jest.fn(),
      };

      jest.spyOn(apiKeyRepository, 'findOne').mockResolvedValue(apiKey as any);
      jest
        .spyOn(apiKeyRepository, 'save')
        .mockResolvedValue({ ...apiKey, isActive: false } as any);

      await service.revokeApiKey(userId, apiKeyId);

      expect(apiKeyRepository.findOne).toHaveBeenCalledWith({
        where: { id: apiKeyId, user: { id: userId } },
      });
      expect(apiKey.isActive).toBe(false);
      expect(apiKeyRepository.save).toHaveBeenCalledWith(apiKey);
    });

    it('should throw BadRequestException if API key not found', async () => {
      const userId = 'user-uuid';
      const apiKeyId = 'nonexistent-api-key';

      jest.spyOn(apiKeyRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.revokeApiKey(userId, apiKeyId)).rejects.toThrow(
        BadRequestException,
      );
      expect(apiKeyRepository.findOne).toHaveBeenCalledWith({
        where: { id: apiKeyId, user: { id: userId } },
      });
    });
  });

  describe('findByKey', () => {
    it('should return API key entity if key is valid and active', async () => {
      const apiKey = {
        id: 'api-key-uuid',
        key: 'valid-key',
        isActive: true,
        user: { id: 'user-uuid', email: 'test@example.com' },
      };

      jest.spyOn(apiKeyRepository, 'findOne').mockResolvedValue(apiKey as any);

      const result = await service.findByKey('valid-key');

      expect(apiKeyRepository.findOne).toHaveBeenCalledWith({
        where: { key: 'valid-key', isActive: true },
        relations: ['user'],
      });
      expect(result).toEqual(apiKey);
    });

    it('should return undefined if API key is invalid or inactive', async () => {
      jest.spyOn(apiKeyRepository, 'findOne').mockResolvedValue(undefined);

      const result = await service.findByKey('invalid-key');

      expect(apiKeyRepository.findOne).toHaveBeenCalledWith({
        where: { key: 'invalid-key', isActive: true },
        relations: ['user'],
      });
      expect(result).toBeUndefined();
    });
  });
});
