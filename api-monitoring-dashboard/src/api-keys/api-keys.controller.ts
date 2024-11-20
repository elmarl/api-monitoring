import {
  Controller,
  Post,
  Get,
  Delete,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api-keys')
export class ApiKeysController {
  constructor(private apiKeysService: ApiKeysService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async generate(@Req() req) {
    const userId = req.user.userId;
    const apiKey = await this.apiKeysService.generateApiKey(userId);
    return { apiKey: apiKey.key };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req) {
    const userId = req.user.userId;
    const apiKeys = await this.apiKeysService.listApiKeys(userId);
    return apiKeys.map((key) => ({
      id: key.id,
      key: key.key,
      createdAt: key.createdAt,
    }));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async revoke(@Req() req, @Param('id') id: string) {
    const userId = req.user.userId;
    await this.apiKeysService.revokeApiKey(userId, id);
    return { message: 'API Key revoked successfully' };
  }
}
