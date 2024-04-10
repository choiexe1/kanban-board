import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { BcryptService } from 'src/bcrypt/bcrypt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly bcrpytService: BcryptService,
  ) {}

  async create(username: string, password: string): Promise<User> {
    const exist = await this.userRepository.existsBy({
      username,
    });

    if (exist) {
      throw new UnprocessableEntityException('이미 사용중인 유저네임입니다.');
    }

    const newUser = this.userRepository.create({
      username,
      password: await this.bcrpytService.hash(password),
    });

    await this.userRepository.save(newUser);

    return await this.userRepository.findOneBy({
      username,
    });
  }
}
