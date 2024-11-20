import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUsageDto } from './dto/create-usage.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKeysService } from '../api-keys/api-keys.service';
import { Usage } from './usage.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UsageService {
  constructor(
    @InjectRepository(Usage)
    private usageRepository: Repository<Usage>,
    private apiKeysService: ApiKeysService,
    private redisService: RedisService,
  ) {}

  async logUsage(
    apiKey: string,
    createUsageDto: CreateUsageDto,
  ): Promise<void> {
    const apiKeyEntity = await this.apiKeysService.findByKey(apiKey);
    if (!apiKeyEntity) {
      throw new UnauthorizedException('Invalid API Key');
    }

    const usage = this.usageRepository.create({
      method: createUsageDto.method,
      endpoint: createUsageDto.endpoint,
      statusCode: createUsageDto.statusCode,
      responseTime: createUsageDto.responseTime,
      timestamp: new Date(createUsageDto.timestamp),
      apiKey: apiKeyEntity,
    });

    await this.usageRepository.save(usage);

    // Publish to Redis Pub/Sub for real-time updates
    await this.redisService.publish(
      'usage',
      JSON.stringify({
        userId: apiKeyEntity.user.id,
        usage: {
          method: usage.method,
          endpoint: usage.endpoint,
          statusCode: usage.statusCode,
          responseTime: usage.responseTime,
          timestamp: usage.timestamp,
        },
      }),
    );
  }
}
