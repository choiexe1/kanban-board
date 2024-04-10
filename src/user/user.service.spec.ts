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
});
