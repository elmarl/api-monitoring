import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked_jwt_token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data if valid credentials', async () => {
      const user = { id: 'uuid', email: 'test@example.com', name: 'Test User' };
      (usersService.validateUser as jest.Mock).mockResolvedValue(user);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(usersService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(result).toEqual(user);
    });

    it('should return null if invalid credentials', async () => {
      (usersService.validateUser as jest.Mock).mockResolvedValue(null);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );

      expect(usersService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const user = { id: 'uuid', email: 'test@example.com' };
      const payload = { username: user.email, sub: user.id };

      const result = await service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ access_token: 'mocked_jwt_token' });
    });
  });
});
