import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guard/local-auth.guard';
import { User } from 'src/user/entity/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { CurrentUser } from 'src/shared/CurrentUser.decorator';
import { JwtService } from 'src/jwt/jwt.service';
import { TokenPayload } from 'src/jwt/token-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/signup')
  async signUp(@Body() dto: SignUpDto) {
    const { username, password } = dto;

    return await this.authService.signUp(username, password);
  }

  @UseGuards(LocalGuard)
  @Post('/login')
  login(@CurrentUser() user: User) {
    const payload: TokenPayload = {
      id: user.id,
      username: user.username,
    };

    return { accessToken: this.jwtService.generateAccessToken(payload) };
  }
}
