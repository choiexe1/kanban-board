import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { JsonWebTokenError, JwtService as Jwt } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';
import { ConfigServiceMock } from 'src/configuration/config.service.mock';

describe('JwtService', () => {
  let jwtService: JwtService;

  beforeEach(async () => {
    jest.useRealTimers();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        JwtService,
        Jwt,
        {
          provide: ConfigService,
          useValue: ConfigServiceMock,
        },
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  describe('generateAccessToken', () => {
    it('should return JWT', () => {
      // Arrange
      const payload: TokenPayload = {
        id: 1,
        username: 'test1234',
      };

      // Act
      const result = jwtService.generateAccessToken(payload);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true if token is valid', () => {
      // Arrange
      const payload: TokenPayload = {
        id: 1,
        username: 'test1234',
      };

      const accessToken = jwtService.generateAccessToken(payload);

      // Act
      const result = jwtService.verify(accessToken, {
        secret: 'test',
      });

      // Assert
      expect(result).toBeTruthy();
    });

    it('should throw an error if token is malformed', () => {
      // Arrange
      const accessToken = 'asuadriasudf0zxcv';

      // Act
      // Assert
      expect(async () =>
        jwtService.verify(accessToken, {
          secret: 'test',
        }),
      ).rejects.toThrow(new JsonWebTokenError('jwt malformed'));
    });

    it('should throw an error if token is expired', () => {
      // Arrange
      const payload: TokenPayload = {
        id: 1,
        username: 'test1234',
      };

      const accessToken = jwtService.generateAccessToken(payload);

      jest.useFakeTimers();
      jest.advanceTimersByTime(86400000);

      // Act
      // Assert
      expect(() =>
        jwtService.verify(accessToken, {
          secret: 'test',
        }),
      ).toThrow(new JsonWebTokenError('jwt expired'));
    });

    it('should throw an error if token signature is difference', () => {
      // Arrange
      const payload: TokenPayload = {
        id: 1,
        username: 'test1234',
      };

      const accessToken = jwtService.generateAccessToken(payload);
      // Act
      // Assert
      expect(() =>
        jwtService.verify(accessToken, {
          secret: 'asdfasdf',
        }),
      ).toThrow(new JsonWebTokenError('invalid signature'));
    });
  });
});
