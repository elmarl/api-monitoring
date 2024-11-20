import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = app.get(DataSource);

    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await app.close();
  });

  describe('/users/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/users/register')
        .send({
          email: 'e2e-test@example.com',
          password: 'password123',
          name: 'E2E Test User',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body).toHaveProperty('email', 'e2e-test@example.com');
          expect(response.body).toHaveProperty('name', 'E2E Test User');
          expect(response.body).not.toHaveProperty('password');
        });
    });

    it('should not register a user with existing email', () => {
      return request(app.getHttpServer())
        .post('/users/register')
        .send({
          email: 'e2e-test@example.com',
          password: 'password123',
          name: 'E2E Test User',
        })
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe('Email already in use');
        });
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login a registered user and return JWT token', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'e2e-test@example.com',
          password: 'password123',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('access_token');
        });
    });

    it('should not login with incorrect password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'e2e-test@example.com',
          password: 'wrongpassword',
        })
        .expect(401)
        .then((response) => {
          expect(response.body.message).toBe('Invalid credentials');
        });
    });

    it('should not login a non-existent user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401)
        .then((response) => {
          expect(response.body.message).toBe('Invalid credentials');
        });
    });
  });
});
