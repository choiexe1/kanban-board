import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt.service';

describe('BcryptService', () => {
  let bcryptService: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    bcryptService = module.get<BcryptService>(BcryptService);
  });

  it('should be defined', () => {
    expect(bcryptService).toBeDefined();
  });

  describe('hash', () => {
    it('It should return a hash string, with a length of 60.', async () => {
      // Arrange
      const plain = 'test';

      // Act
      const result = await bcryptService.hash(plain);

      // Assert
      expect(result).toHaveLength(60);
    });
  });

  describe('compare', () => {
    it('If it is a valid hash string, it should return true.', async () => {
      // Arrange
      const plain = 'plain text';
      const hash = await bcryptService.hash(plain);

      // Act
      const result = await bcryptService.compare(plain, hash);

      // Assert
      expect(result).toEqual(true);
    });

    it('If it is not a valid hash string, it should return false.', async () => {
      // Arrange
      const plain = 'plain text';
      const hash = await bcryptService.hash('not valid');

      // Act
      const result = await bcryptService.compare(plain, hash);

      // Assert
      expect(result).toEqual(false);
    });
  });
});
