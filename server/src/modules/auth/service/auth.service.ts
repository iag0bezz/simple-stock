import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private service: JwtService) {}

  generateToken(user: any): Promise<string> {
    return this.service.signAsync({ user });
  }

  decodeToken(token: string): string | { [key: string]: any } {
    return this.service.decode(token);
  }

  hashPassword(password: string): Promise<string> {
    return hash(password, 12);
  }

  comparePassword(password: string, hashed: string): Promise<boolean> {
    return compare(password, hashed);
  }
}
