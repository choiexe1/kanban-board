import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { User } from 'src/user/entity/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { CurrentUser } from 'src/shared/CurrentUser.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() dto: SignUpDto) {
    const { username, password } = dto;

    return await this.authService.signUp(username, password);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@CurrentUser() user: User) {}
}
