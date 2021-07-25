import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationController } from './controller/organization.controller';
import { OrganizationModel } from './domain/organization.entity';
import { OrganizationService } from './service/organization.service';
import { OrganizationSubModules } from './submodules/submodule.module';

@Module({
  imports: [
    forwardRef(() => OrganizationModel),
    TypeOrmModule.forFeature([OrganizationModel]),
    OrganizationSubModules,
  ],
  providers: [OrganizationService],
  exports: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
