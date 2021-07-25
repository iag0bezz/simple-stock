import { forwardRef, HttpException, HttpStatus, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { extname } from 'path';
import { OrganizationModule } from '../../organization.module';
import { OrganizationImageController } from './controller/image.controller';
import { OrganizationImageModel } from './domain/image.entity';
import { OrganizationImageService } from './service/image.service';

const imageFilter = (request, file, callback) => {
  if (!file.originalname.match()) {
    callback(
      new HttpException(
        `Unsupported file type ${extname(file.originalname)}`,
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

@Module({
  imports: [
    forwardRef(() => OrganizationImageModel),
    TypeOrmModule.forFeature([OrganizationImageModel]),
    MulterModule.registerAsync({
      useFactory: () => ({
        fileFilter: imageFilter,
      }),
    }),
    forwardRef(() => OrganizationModule),
  ],
  providers: [OrganizationImageService],
  controllers: [OrganizationImageController],
  exports: [OrganizationImageService],
})
export class OrganizationImageModule {}
