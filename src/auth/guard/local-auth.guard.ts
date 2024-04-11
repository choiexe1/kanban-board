import {
  BadRequestException,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { LoginDto } from '../dto/login.dto';
import { validate } from 'class-validator';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const body = plainToClass(LoginDto, request.body);
    const errors = await validate(body);

    const errorMessages = errors.flatMap(({ constraints }) =>
      Object.values(constraints),
    );

    if (errorMessages.length > 0) {
      throw new BadRequestException({
        message: errorMessages,
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
