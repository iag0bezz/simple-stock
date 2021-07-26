import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthTokenModel } from './domain/token.entity';
import { JwtAuthGuard } from './guard/auth.guard';
import { AuthService } from './service/auth.service';
import { AuthTokenService } from './service/token.service';
import { AuthStrategy } from './strategy/auth.strategy';

@Module({
  imports: [
    forwardRef(() => AuthTokenModel),
    TypeOrmModule.forFeature([AuthTokenModel]),
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES') },
      }),
    }),
  ],
  providers: [AuthTokenService, AuthService, JwtAuthGuard, AuthStrategy],
  exports: [AuthService, AuthTokenService],
  controllers: [AuthController],
})
export class AuthModule {}
