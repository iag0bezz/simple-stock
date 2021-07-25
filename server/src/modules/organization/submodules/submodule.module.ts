import { forwardRef, Module } from '@nestjs/common';
import { OrganizationModule } from '../organization.module';
import { OrganizationImageModule } from './image/image.module';

@Module({
  imports: [forwardRef(() => OrganizationModule), OrganizationImageModule],
})
export class OrganizationSubModules {}
