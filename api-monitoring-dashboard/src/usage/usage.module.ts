import { Module } from '@nestjs/common';
import { UsageService } from './usage.service';
import { UsageController } from './usage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { RedisModule } from '../redis/redis.module';
import { Usage } from './usage.entity';
import { UsageGateway } from './usage.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usage]),
    ApiKeysModule,
    RedisModule,
    AuthModule,
  ],
  providers: [UsageService, UsageGateway],
  controllers: [UsageController],
})
export class UsageModule {}
