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
import { UserService } from 'src/modules/user/service/user.service';
import { AuthLoginDto } from '../domain/dto/auth.login.dto';
import { AuthRefreshDto } from '../domain/dto/auth.refresh.dto';
import { AuthRegisterDto } from '../domain/dto/auth.register.dto';
import { JwtAuthGuard } from '../guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(forwardRef(() => UserService)) private service: UserService,
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
  async login(@Body() details: AuthLoginDto) {
    return await this.service.login(details);
  }

  @Post('register')
  async register(@Body() details: AuthRegisterDto) {
    const user = await this.service.findByEmail(details.email);

    if (user !== undefined) {
      throw new HttpException('Email already in use.', HttpStatus.CONFLICT);
    }

    await this.service.create(details);

    return await this.service.login({
      email: details.email,
      password: details.password,
    });
  }

  @Post('refresh')
  async refresh(@Body() details: AuthRefreshDto) {
    return await this.service.refreshToken(details);
  }
}
