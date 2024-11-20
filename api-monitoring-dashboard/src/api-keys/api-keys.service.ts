import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from './api-key.entity';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeysRepository: Repository<ApiKey>,
    private usersService: UsersService,
  ) {}

  async generateApiKey(userId: string): Promise<ApiKey> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const key = uuidv4();

    const apiKey = this.apiKeysRepository.create({
      key,
      user,
    });

    return this.apiKeysRepository.save(apiKey);
  }

  async listApiKeys(userId: string): Promise<ApiKey[]> {
    return this.apiKeysRepository.find({
      where: { user: { id: userId }, isActive: true },
    });
  }

  async revokeApiKey(userId: string, keyId: string): Promise<void> {
    const apiKey = await this.apiKeysRepository.findOne({
      where: { id: keyId, user: { id: userId } },
    });
    if (!apiKey) {
      throw new BadRequestException('API Key not found');
    }
    apiKey.isActive = false;
    await this.apiKeysRepository.save(apiKey);
  }

  async findByKey(key: string): Promise<ApiKey | undefined> {
    return this.apiKeysRepository.findOne({
      where: { key, isActive: true },
      relations: ['user'],
    });
  }
}
