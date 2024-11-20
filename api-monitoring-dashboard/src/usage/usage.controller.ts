import {
  Controller,
  Post,
  Body,
  Headers,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UsageService } from './usage.service';
import { CreateUsageDto } from './dto/create-usage.dto';
import { IsString } from 'class-validator';
import { ApiKeyGuard } from '../auth/api-key.guard';

class UsageHeaders {
  @IsString()
  authorization: string;
}

@Controller('usage')
export class UsageController {
  constructor(private usageService: UsageService) {}

  @UseGuards(ApiKeyGuard)
  @Post()
  async logUsage(
    @Body() createUsageDto: CreateUsageDto,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid Authorization header');
    }
    await this.usageService.logUsage(authHeader.split(' ')[1], createUsageDto);
    return { message: 'Usage logged successfully' };
  }
}
