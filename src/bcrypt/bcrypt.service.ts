import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private readonly SALT = 10;

  async hash(plain: string) {
    return bcrypt.hash(plain, this.SALT);
  }

  async compare(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
  }
}
