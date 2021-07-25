import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserModel } from './domain/user.entity';

@Module({
  imports: [
    forwardRef(() => UserModel),
    TypeOrmModule.forFeature([UserModel]),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
