import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TransformInterceptor } from 'src/shared/transform.interceptor';
import { LoginDto } from 'src/auth/dto/login.dto';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe({
            whitelist: true,
            transform: true,
          }),
        },
        {
          provide: APP_INTERCEPTOR,
          useValue: new TransformInterceptor(),
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth', () => {
    describe('/signup (POST)', () => {
      const url = '/auth/signup';

      it('If the request body is not valid, should return an error.', async () => {
        // Arrange
        const signUpDto = {
          username: 'test1234',
        };

        // Act
        const res = await request(app.getHttpServer())
          .post(url)
          .send(signUpDto);

        // Assert
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('error');
        expect(res.body).toHaveProperty('statusCode');
      });

      it('should be successfully signed up.', async () => {
        // Arrange
        const signUpDto: SignUpDto = {
          username: 'test1234',
          password: 'test1234',
        };

        // Act
        const res = await request(app.getHttpServer())
          .post(url)
          .send(signUpDto);

        // Assert
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBeTruthy();
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data).toHaveProperty('username');
        expect(res.body.data.password).toBeUndefined();
      });

      it('If the username is already in use, the signup should fail and return an error.', async () => {
        // Arrange
        const signUpDto: SignUpDto = {
          username: 'test1234',
          password: 'test1234',
        };

        // Act
        const res = await request(app.getHttpServer())
          .post(url)
          .send(signUpDto);

        // Assert
        expect(res.statusCode).toBe(422);
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('error');
        expect(res.body).toHaveProperty('statusCode');
        expect(res.body.message).toBe('이미 사용중인 유저네임입니다.');
      });
    });

    describe('/login (POST)', () => {
      const url = '/auth/login';

      it('If the request body is not valid, should return an error.', async () => {
        // Arrange
        const loginDto = {
          username: 'test1234',
        };

        // Act
        const res = await request(app.getHttpServer()).post(url).send(loginDto);

        // Assert
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('error');
        expect(res.body).toHaveProperty('statusCode');
      });

      it('If the login was successful, should return an access token and a refresh token.', async () => {
        // Arrange
        const loginDto: SignUpDto = {
          username: 'test1234',
          password: 'test1234',
        };

        // Act
        const res = await request(app.getHttpServer()).post(url).send(loginDto);

        // Assert
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBeTruthy();
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data).toHaveProperty('refreshToken');
      });

      it('If the username does not exist, an error should be returned.', async () => {
        // Arrange
        const loginDto: SignUpDto = {
          username: 'nonexistuser',
          password: 'test1234',
        };

        // Act
        const res = await request(app.getHttpServer()).post(url).send(loginDto);

        // Assert
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('error');
        expect(res.body).toHaveProperty('statusCode');
        expect(res.body.message).toBe('존재하지 않는 유저네임입니다.');
      });

      it('If the passwords does not match, should return an error.', async () => {
        // Arrange
        const loginDto: LoginDto = {
          username: 'test1234',
          password: 'nopassword',
        };

        // Act
        const res = await request(app.getHttpServer()).post(url).send(loginDto);

        // Assert
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('error');
        expect(res.body).toHaveProperty('statusCode');
        expect(res.body.message).toBe('패스워드가 일치하지 않습니다.');
      });
    });
  });

  // TODO: /user delete
  describe('/user', () => {
    const loginDto = {
      username: 'test1234',
      password: 'test1234',
    };

    let accessToken: string;
    let refreshToken: string;

    beforeAll(async () => {
      const login = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto);

      accessToken = login.body.data.accessToken;
      refreshToken = login.body.data.refreshToken;
    });

    describe('(DELETE)', () => {
      const url = '/user';

      it('If the token is valid and the user exists, the user should be deleted.', async () => {
        // Arrange
        // Act
        const res = await request(app.getHttpServer())
          .delete(url)
          .set('Authorization', `Bearer ${accessToken}`);

        // Assert
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBeTruthy();
      });

      it('If the token is invalid, an error should be returned.', async () => {
        // Arrange
        // Act
        const res = await request(app.getHttpServer())
          .delete(url)
          .set('Authorization', `Bearer ${accessToken + 's'}`);

        // Assert
        expect(res.statusCode).toBe(401);
      });
    });
  });
});
