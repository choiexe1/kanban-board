import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guard/local-auth.guard';
import { User } from 'src/user/entity/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { CurrentUser } from 'src/shared/CurrentUser.decorator';
import { JwtService } from 'src/jwt/jwt.service';
import { TokenPayload } from 'src/jwt/token-payload.interface';
import { UserService } from 'src/user/user.service';
import { RtGuard } from './guard/refresh-token.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/signup')
  async signUp(@Body() dto: SignUpDto) {
    const { username, password } = dto;

    return await this.authService.signUp(username, password);
  }

  @UseGuards(LocalGuard)
  @Post('/login')
  async login(@CurrentUser() user: User) {
    const payload: TokenPayload = {
      id: user.id,
      username: user.username,
    };

    const accessToken = this.jwtService.generateAccessToken(payload);
    const refreshToken = this.jwtService.generateRefreshToken(payload);

    await this.userService.update({ id: user.id }, { refreshToken });

    return {
      accessToken,
      refreshToken,
    };
  }

  @UseGuards(RtGuard)
  @Post('/refresh')
  async refresh(@CurrentUser() user: User) {
    const payload: TokenPayload = {
      id: user.id,
      username: user.username,
    };

    const accessToken = this.jwtService.generateAccessToken(payload);
    const refreshToken = this.jwtService.generateRefreshToken(payload);

    await this.userService.update({ id: user.id }, { refreshToken });

    return {
      accessToken,
      refreshToken,
    };
  }
}
