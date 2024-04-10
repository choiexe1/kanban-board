import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BcryptService } from 'src/bcrypt/bcrypt.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  const userRepositoryToken = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: userRepositoryToken,
          useClass: Repository,
        },
        {
          provide: BcryptService,
          useValue: {
            hash: jest.fn(),
            compare: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });
});
