import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthTokenModel } from '../domain/token.entity';
import { AuthService } from './auth.service';

@Injectable()
export class AuthTokenService {
  constructor(
    @InjectRepository(AuthTokenModel)
    private repository: Repository<AuthTokenModel>,
    private service: AuthService,
  ) {}

  find(token: string): Promise<AuthTokenModel> {
    return this.repository.findOne({ token });
  }

  async create(token: string, userId: string): Promise<AuthTokenModel> {
    const created = await this.repository.create({ token, userId });

    return this.repository.save(created);
  }

  delete(id: string) {
    return this.repository.delete({ userId: id });
  }

  async verify(token: string) {
    return await this.service.verify(token);
  }
}
