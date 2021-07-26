import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private service: JwtService, private config: ConfigService) {}

  generateToken(user: any): Promise<string> {
    return this.service.signAsync({ user });
  }

  generateRefreshToken(user: any): Promise<string> {
    return this.service.signAsync(
      { user },
      {
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES'),
        secret: this.config.get('JWT_REFRESH_SECRET'),
      },
    );
  }

  decodeToken(token: string): string | { [key: string]: any } {
    return this.service.decode(token);
  }

  verify(token: string) {
    return this.service.verifyAsync(token, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });
  }

  hashPassword(password: string): Promise<string> {
    return hash(password, 12);
  }

  comparePassword(password: string, hashed: string): Promise<boolean> {
    return compare(password, hashed);
  }
}
