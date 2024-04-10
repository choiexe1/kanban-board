import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnprocessableEntityException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;
  let userRepository: Repository<User>;
  const userRepositoryToken = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        BcryptService,
        {
          provide: userRepositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('POST /signUp', () => {
    it('If the username is not in use, the user should be returned.', async () => {
      // Arrange
      const newUser = {
        username: 'test1234',
        password: 'test1234',
      };

      authService.signUp = jest
        .fn()
        .mockResolvedValue(Object.assign(newUser, { id: 1 }));

      // Act
      const result = await authController.signUp(newUser);

      // Assert
      expect(authService.signUp).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('username', newUser.username);
      expect(result).toHaveProperty('password', newUser.password);
    });

    it('If the username is in use, an error should be returned.', async () => {
      // Arrange
      const newUser = {
        username: 'test1234',
        password: 'test1234',
      };

      userRepository.existsBy = jest.fn().mockResolvedValue(true);

      // Act
      // Assert
      await expect(
        async () => await authController.signUp(newUser),
      ).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('POST /login', () => {
    it('', async () => {});
  });
});
