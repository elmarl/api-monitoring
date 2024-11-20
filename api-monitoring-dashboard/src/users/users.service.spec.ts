import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository, // Use a mock or fake repository
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };
      const hashedPassword = await bcrypt.hash(userDto.password, 10);

      const savedUser = { id: 'uuid', ...userDto, password: hashedPassword };

      jest.spyOn(repository, 'create').mockReturnValue(savedUser as any);
      jest.spyOn(repository, 'save').mockResolvedValue(savedUser as any);

      const result = await service.create(
        userDto.email,
        userDto.password,
        userDto.name,
      );

      expect(repository.create).toHaveBeenCalledWith({
        email: userDto.email,
        password: userDto.password,
        name: userDto.name,
      });
      expect(repository.save).toHaveBeenCalledWith(savedUser);
      expect(result).toEqual(savedUser);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = {
        id: 'uuid',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(user as any);

      const result = await service.findByEmail(user.email);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: user.email },
      });
      expect(result).toEqual(user);
    });

    it('should return undefined if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(result).toBeUndefined();
    });
  });

  describe('validateUser', () => {
    it('should return user data if valid credentials', async () => {
      const user = {
        id: 'uuid',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
      };
      jest.spyOn(service, 'findByEmail').mockResolvedValue(user as any);

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      const result = await service.validateUser(user.email, 'password123');

      expect(service.findByEmail).toHaveBeenCalledWith(user.email);
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', user.password);
      expect(result).toEqual(user);
    });

    it('should return null if invalid password', async () => {
      const user = {
        id: 'uuid',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
      };
      jest.spyOn(service, 'findByEmail').mockResolvedValue(user as any);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      const result = await service.validateUser(user.email, 'wrongpassword');

      expect(service.findByEmail).toHaveBeenCalledWith(user.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        user.password,
      );
      expect(result).toBeNull();
    });

    it('should return null if user not found', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(undefined);

      const result = await service.validateUser(
        'nonexistent@example.com',
        'password123',
      );

      expect(service.findByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
      expect(result).toBeNull();
    });
  });
});
