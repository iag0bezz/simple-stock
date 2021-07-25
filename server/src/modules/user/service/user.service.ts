import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/modules/auth/service/auth.service';
import { Repository } from 'typeorm';
import { UserCreateDto } from '../domain/dto/user.create.dto';
import { UserLoginDto } from '../domain/dto/user.login.dto';
import { UserModel } from '../domain/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private repository: Repository<UserModel>,
    private service: AuthService,
  ) {}

  findByEmail(email: string): Promise<UserModel> {
    return this.repository.findOne({ email });
  }

  findById(id: string): Promise<UserModel> {
    return this.repository.findOne(id);
  }

  async create(details: UserCreateDto): Promise<UserModel> {
    const model = this.repository.create(details);

    model.password = await this.service.hashPassword(model.password);

    return this.repository.save(model);
  }

  async login(details: UserLoginDto): Promise<string> {
    const user = await this.repository.findOne(
      { email: details.email },
      { select: ['id', 'email', 'password'] },
    );

    if (user === undefined) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!this.service.comparePassword(details.password, user.password)) {
      throw new HttpException(
        'Email or password invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.service.generateToken({ id: user.id });
  }
}
