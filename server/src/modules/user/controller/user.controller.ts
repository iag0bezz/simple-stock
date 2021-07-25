import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserCreateDto } from '../domain/dto/user.create.dto';
import { UserService } from '../service/user.service';
import { UserModel } from '../domain/user.entity';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private service: UserService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiOkResponse({
    status: 200,
    description: 'Create a new user',
    type: UserModel,
  })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  @Post()
  async create(@Body() details: UserCreateDto) {
    const user = await this.service.findByEmail(details.email);

    if (user !== undefined) {
      throw new HttpException('Email already in use', HttpStatus.CONFLICT);
    }

    return await this.service.create(details);
  }
}
