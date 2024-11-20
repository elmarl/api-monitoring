import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiKeysService } from '../api-keys/api-keys.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const apiKey = authHeader.split(' ')[1];
    const validKey = await this.apiKeysService.findByKey(apiKey);
    if (!validKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    request.user = { userId: validKey.user.id, email: validKey.user.email };
    return true;
  }
}
