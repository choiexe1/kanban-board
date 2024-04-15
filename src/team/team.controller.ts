import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CurrentUser } from 'src/shared/current-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { AtGuard } from 'src/auth/guard/access-token.guard';

@Controller('team')
@UseInterceptors(ClassSerializerInterceptor)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @UseGuards(AtGuard)
  async create(@CurrentUser() user: User, @Body('name') name: string) {
    return await this.teamService.create(user.id, name);
  }
}
