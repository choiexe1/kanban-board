import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceMock } from 'src/configuration/config.service.mock';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let bcryptService: BcryptService;
  let userRepository: Repository<User>;
  const userRepositoryToken = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        AuthService,
        BcryptService,
        UserService,
        {
          provide: userRepositoryToken,
          useClass: Repository,
        },
        JwtService,
        { provide: ConfigService, useValue: ConfigServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
    bcryptService = module.get<BcryptService>(BcryptService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(bcryptService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('signUp', () => {
    it('If the username is not being used, should be create a user and return', async () => {
      // Arrange
      const newUser = {
        username: 'test1234',
        password: 'test1234',
      };

      const user = Object.assign(newUser, { id: 1 });

      userRepository.existsBy = jest.fn().mockResolvedValue(false);
      userRepository.findOneBy = jest
        .fn()
        .mockResolvedValue(Object.assign(user));

      userRepository.create = jest.fn();
      userRepository.save = jest.fn();

      // Act
      const result = await authService.signUp(
        newUser.username,
        newUser.password,
      );

      // Assert
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('username', newUser.username);
      expect(result).toHaveProperty('password', newUser.password);
    });

    it('If the username in use, should not be created and an error should be returned', async () => {
      // Arrange
      const newUser = {
        username: 'test1234',
        password: 'test1234',
      };

      userRepository.existsBy = jest.fn().mockResolvedValue(true);
      userRepository.create = jest.fn();
      userRepository.save = jest.fn();

      // Act
      // Assert
      await expect(
        async () =>
          await authService.signUp(newUser.username, newUser.password),
      ).rejects.toThrow(
        new UnprocessableEntityException('이미 사용중인 유저네임입니다.'),
      );
    });
  });

  describe('login', () => {
    it('If the user exists and the password matches, you should return a Access Token and Refresh Token.', async () => {
      // Arrange
      const user = {
        username: 'test1234',
        password: 'test1234',
      };

      userService.findOne = jest
        .fn()
        .mockResolvedValue(Object.assign(user, { id: 1 }));

      bcryptService.compare = jest.fn().mockResolvedValue(true);

      // Act
      const result = await authService.login(user.username, user.password);

      // Assert
      expect(result).toBe(Object.assign(user, { id: 1 }));
    });

    it('If the user does not exist, an error should be returned.', async () => {
      // Arrange
      const user = {
        username: 'test1234',
        password: 'test1234',
      };

      userService.findOne = jest.fn().mockResolvedValue(null);

      // Act
      // Assert
      await expect(
        async () => await authService.login(user.username, user.password),
      ).rejects.toThrow(
        new BadRequestException('존재하지 않는 유저네임입니다.'),
      );
    });

    it('If the user exists but the password does not match, an error should be returned.', async () => {
      // Arrange
      const user = {
        username: 'test1234',
        password: 'test1234',
      };

      userService.findOne = jest
        .fn()
        .mockResolvedValue(
          Object.assign(user, { id: 1, password: 'not valid' }),
        );

      // Act
      // Assert
      await expect(
        async () => await authService.login(user.username, user.password),
      ).rejects.toThrow(
        new BadRequestException('패스워드가 일치하지 않습니다.'),
      );
    });
  });
});
