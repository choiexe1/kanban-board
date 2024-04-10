import { TestingModule, Test } from '@nestjs/testing';
import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { createMock } from '@golevelup/ts-jest';
import { LocalStrategy } from '../strategy/local.strategy';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { JwtService } from 'src/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceMock } from 'src/configuration/config.service.mock';

describe('LocalAuthGuard', () => {
  let localAuthGuard: LocalAuthGuard;
  let authService: AuthService;
  const userRepositoryToken = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        LocalAuthGuard,
        LocalStrategy,
        AuthService,
        UserService,
        {
          provide: userRepositoryToken,
          useClass: Repository,
        },
        JwtService,
        {
          provide: ConfigService,
          useValue: ConfigServiceMock,
        },
        BcryptService,
      ],
    }).compile();

    localAuthGuard = module.get<LocalAuthGuard>(LocalAuthGuard);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(localAuthGuard).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('canActivate', () => {
    it('should allow activation for valid credentials', async () => {
      // Arrange
      const user = {
        username: 'test1234',
        password: 'test1234',
      };

      const context = createMock<ExecutionContext>();

      context.switchToHttp().getRequest.mockReturnValue({
        body: user,
      });

      authService.login = jest
        .fn()
        .mockResolvedValue(Object.assign(user, { id: 1 }));

      // Act

      const result = await localAuthGuard.canActivate(context);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(
        user.username,
        user.password,
      );
      expect(result).toBe(true);
    });

    it('should throw BadRequestException for invalid credentials', async () => {
      // Arrange
      const user = {
        username: 'test1234',
      };

      const context = createMock<ExecutionContext>();

      context.switchToHttp().getRequest.mockReturnValue({
        body: user,
      });

      // Act
      // Assert
      await expect(
        async () => await localAuthGuard.canActivate(context),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
