import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UnprocessableEntityException } from '@nestjs/common';
import { BcryptService } from 'src/bcrypt/bcrypt.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let bcrpytService: BcryptService;
  const userRepositoryToken = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: userRepositoryToken,
          useClass: Repository,
        },
        BcryptService,
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
    bcrpytService = module.get<BcryptService>(BcryptService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('If the username is not being used, should be create a user', async () => {
      // Arrange
      const newUser = {
        username: 'test1234',
        password: 'test1234',
      };

      userRepository.existsBy = jest.fn().mockResolvedValue(false);
      userRepository.findOneBy = jest.fn().mockResolvedValue({
        username: newUser.username,
        password: newUser.password,
      });
      bcrpytService.hash = jest.fn();

      userRepository.create = jest.fn();
      userRepository.save = jest.fn();
      userRepository.findOneBy = jest.fn().mockResolvedValue({
        username: newUser.username,
        password: newUser.password,
      });

      // Act
      const result = await userService.create(
        newUser.username,
        newUser.password,
      );

      // Assert
      expect(result).toEqual(newUser);
    });

    it('If the username is in use, the user should not be created and an error should be returned', async () => {
      // Arrange
      const newUser = {
        username: 'test1234',
        password: 'test1234',
      };

      userRepository.existsBy = jest.fn().mockResolvedValue(true);

      bcrpytService.hash = jest.fn();

      userRepository.create = jest.fn();
      userRepository.save = jest.fn();
      userRepository.findOneBy = jest.fn().mockResolvedValue({
        username: newUser.username,
        password: newUser.password,
      });

      // Act
      // Assert
      await expect(
        async () =>
          await userService.create(newUser.username, newUser.password),
      ).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('update', () => {
    it('Some properties of the user should be updated to match the input and return true', async () => {
      // Arrange
      const user = {
        username: 'test1234',
        password: 'test1234',
      };

      userRepository.findOne = jest.fn().mockResolvedValue({
        username: user.username,
        password: user.password,
        refreshToken: null,
      });

      userRepository.update = jest.fn().mockResolvedValue({
        affected: 1,
      });

      // Act
      const result = await userService.update(
        {
          username: user.username,
        },
        { refreshToken: 'abc' },
      );

      // Assert
      expect(result).toEqual(true);
    });
  });

  describe('delete', () => {
    it('user should be deleted.', async () => {
      // Arrange
      const user: User = {
        id: 1,
        username: 'test1234',
        password: 'test1234',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userRepository.existsBy = jest.fn().mockResolvedValue(true);
      userRepository.delete = jest.fn().mockResolvedValue({
        affected: 1,
      });

      // Act
      const result = await userService.delete(user);

      // Assert
      expect(result).toEqual(true);
    });
  });
});
