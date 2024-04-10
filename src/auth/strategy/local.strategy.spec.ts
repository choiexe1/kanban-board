import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;
  let userService: UserService;
  let bcryptService: BcryptService;
  const userRepositoryToken = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        AuthService,
        UserService,
        BcryptService,
        {
          provide: userRepositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    bcryptService = module.get<BcryptService>(BcryptService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(bcryptService).toBeDefined();
  });

  describe('validate', () => {
    it('If the user exists and the password matches, should return the user.', async () => {
      // Arrange
      const user = {
        username: 'test1234',
        password: 'test1234',
      };

      authService.login = jest
        .fn()
        .mockResolvedValue(Object.assign(user, { id: 1 }));

      //Act
      const result = await localStrategy.validate(user.username, user.password);

      // Assert
      expect(result).toBe(Object.assign(user, { id: 1 }));
    });

    it("If the user doesn't exist, should return an error.", async () => {
      // Arrange
      const user = {
        username: 'test1234',
        password: 'test1234',
      };

      userService.findOne = jest.fn().mockResolvedValue(null);
      // Act

      // Assert
      await expect(
        async () => await localStrategy.validate(user.username, user.password),
      ).rejects.toThrow(
        new BadRequestException('존재하지 않는 유저네임입니다.'),
      );
    });
  });
});
