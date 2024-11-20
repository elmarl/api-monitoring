import { IsString, IsNumber, IsISO8601 } from 'class-validator';

export class CreateUsageDto {
  @IsString()
  method: string;

  @IsString()
  endpoint: string;

  @IsNumber()
  statusCode: number;

  @IsNumber()
  responseTime: number;

  @IsISO8601()
  timestamp: string;
}
