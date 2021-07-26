import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthLoginDto } from 'src/modules/auth/domain/dto/auth.login.dto';
import { AuthRefreshDto } from 'src/modules/auth/domain/dto/auth.refresh.dto';
import { AuthService } from 'src/modules/auth/service/auth.service';
import { AuthTokenService } from 'src/modules/auth/service/token.service';
import { Repository } from 'typeorm';
import { AuthRegisterDto } from '../../auth/domain/dto/auth.register.dto';
import { UserModel } from '../domain/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private repository: Repository<UserModel>,
    private service: AuthService,
    private tokenService: AuthTokenService,
  ) {}

  findByEmail(email: string): Promise<UserModel> {
    return this.repository.findOne({ email });
  }

  findById(id: string): Promise<UserModel> {
    return this.repository.findOne(id);
  }

  async create(details: AuthRegisterDto): Promise<UserModel> {
    const model = this.repository.create(details);

    model.password = await this.service.hashPassword(model.password);

    return this.repository.save(model);
  }

  async login(
    details: AuthLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
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

    await this.tokenService.delete(user.id);

    const token = await this.service.generateToken({ id: user.id });
    const refreshToken = await this.service.generateRefreshToken({
      id: user.id,
    });

    await this.tokenService.create(refreshToken, user.id);

    return {
      accessToken: token,
      refreshToken: refreshToken,
    };
  }

  async refreshToken(details: AuthRefreshDto) {
    const token = await this.tokenService.find(details.refreshToken);

    if (token === undefined) {
      throw new UnauthorizedException('Token invalid or expired.');
    }

    try {
      const { user } = await this.tokenService.verify(details.refreshToken);

      const accessToken = await this.service.generateToken(user);

      return {
        accessToken,
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new HttpException(
          'Session timed out, please login again.',
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (error.name === 'JsonWebTokenError') {
        throw new HttpException(
          'Invalid token, please login again.',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }
}
