import {
  Body,
  Controller,
  forwardRef,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserLoginDto } from 'src/modules/user/domain/dto/user.login.dto';
import { UserService } from 'src/modules/user/service/user.service';
import { JwtAuthGuard } from '../guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(forwardRef(() => UserService)) private service: UserService,
    private config: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() request) {
    const id = request.user.id;

    const user = await this.service.findById(id);

    if (user === undefined) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Post('login')
  async login(@Body() details: UserLoginDto) {
    const token = await this.service.login(details);

    return {
      token: token,
      expires: this.config.get('JWT_EXPIRES'),
    };
  }
}
