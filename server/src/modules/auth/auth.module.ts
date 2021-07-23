import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { JwtAuthGuard } from './guard/auth.guard';
import { AuthService } from './service/auth.service';
import { AuthStrategy } from './strategy/auth.strategy';

@Module({
  imports: [
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
  providers: [AuthService, JwtAuthGuard, AuthStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
