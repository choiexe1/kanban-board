import { Controller, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { AtGuard } from 'src/auth/guard/access-token.guard';
import { CurrentUser } from 'src/shared/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AtGuard)
  @Delete()
  async delete(@CurrentUser() user: User) {
    return await this.userService.delete(user.id);
  }
}
