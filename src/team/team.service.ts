import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  async create(userId: number, name: string) {
    const exist = await this.findOne({
      name,
    });

    if (exist) {
      throw new UnprocessableEntityException('이미 사용중인 팀 이름입니다.');
    }

    const isTeamLeader = await this.findOne({
      leader: {
        id: userId,
      },
    });

    if (isTeamLeader) {
      throw new BadRequestException('팀 생성은 최대 한 개의 팀만 가능합니다.');
    }

    const newTeam = this.teamRepository.create({
      leader: {
        id: userId,
      },
      name,
      member: [{ id: userId }],
    });

    await this.teamRepository.save(newTeam);

    return await this.findOne({ name });
  }

  async findOne(where: FindOptionsWhere<Team>) {
    return this.teamRepository.findOne({
      where,
    });
  }
}
