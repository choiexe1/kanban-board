import { BadRequestException, Injectable } from '@nestjs/common';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
  ) {}

  async signUp(username: string, password: string) {
    return await this.userService.create(username, password);
  }

  async login(username: string, password: string) {
    const user = await this.userService.findOne({
      username,
    });

    if (!user) {
      throw new BadRequestException('존재하지 않는 유저네임입니다.');
    }

    const isMatch = await this.bcryptService.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('패스워드가 일치하지 않습니다.');
    }

    return user;
  }
}
