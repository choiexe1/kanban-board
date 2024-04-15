import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';

describe('TeamService', () => {
  let teamService: TeamService;
  let teamRepository: Repository<Team>;
  const teamRepositoryToken = getRepositoryToken(Team);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: teamRepositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    teamService = module.get<TeamService>(TeamService);
    teamRepository = module.get<Repository<Team>>(teamRepositoryToken);
  });

  it('should be defined', () => {
    expect(teamService).toBeDefined();
    expect(teamRepository).toBeDefined();
  });

  describe('create', () => {
    it('If the team name does not exist, and not own a team, it should create and return a team.', async () => {
      // Arrange
      const user = {
        id: 1,
        username: 'test1234',
      };

      const team = {
        id: 1,
        name: 'Test',
      };

      teamRepository.findOne = jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(team);

      teamRepository.create = jest.fn();
      teamRepository.save = jest.fn();

      // Act
      const result = await teamService.create(user.id, team.name);

      // Assert
      expect(result).toEqual(team);
    });

    it('If the team name is already in use, it should return an error.', async () => {
      // Arrange
      const user = {
        id: 1,
        username: 'test1234',
      };

      const team = {
        id: 1,
        name: 'Test',
      };

      teamRepository.findOne = jest
        .fn()
        .mockResolvedValueOnce({
          team,
        })
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(team);

      teamRepository.create = jest.fn();
      teamRepository.save = jest.fn();

      // Act
      // Assert
      await expect(
        async () => await teamService.create(user.id, team.name),
      ).rejects.toThrow(
        new UnprocessableEntityException('이미 사용중인 팀 이름입니다.'),
      );
    });

    it('If own more than one team, you should return an error.', async () => {
      // Arrange
      const user = {
        id: 1,
        username: 'test1234',
      };

      const team = {
        id: 1,
        name: 'Test',
      };

      teamRepository.findOne = jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(team)
        .mockResolvedValueOnce(team);

      teamRepository.create = jest.fn();
      teamRepository.save = jest.fn();

      // Act
      // Assert
      await expect(
        async () => await teamService.create(user.id, team.name),
      ).rejects.toThrow(
        new BadRequestException('팀 생성은 최대 한 개의 팀만 가능합니다.'),
      );
    });
  });

  describe('findOne', () => {
    it('If the team exists, it should return a team instance.', async () => {
      // Arrange
      const team = {
        id: 1,
        name: 'Test',
      };

      teamRepository.findOne = jest.fn().mockResolvedValue(team);

      // Act
      const result = await teamService.findOne({ id: 1 });

      // Assert
      expect(result).toEqual(team);
    });

    it('If the team does not exist, it should return null.', async () => {
      // Arrange
      teamRepository.findOne = jest.fn().mockResolvedValue(null);

      // Act
      const result = await teamService.findOne({ id: 1 });

      // Assert
      expect(result).toBe(null);
    });
  });
});
