import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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

  async findOne(where: FindOptionsWhere<User>): Promise<User> | null {
    return await this.userRepository.findOne({
      where,
    });
  }

  async update(
    where: FindOptionsWhere<User>,
    partial: QueryDeepPartialEntity<User>,
  ): Promise<boolean> {
    const user = await this.findOne(where);
    const query = await this.userRepository.update(user.id, partial);

    return query.affected === 1;
  }

  async delete(userId: number) {
    const exist = await this.userRepository.existsBy({ id: userId });

    if (exist) {
      const query = await this.userRepository.delete(userId);
      return query.affected === 1;
    }
  }
}
