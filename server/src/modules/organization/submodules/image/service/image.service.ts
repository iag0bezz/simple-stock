import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationService } from 'src/modules/organization/service/organization.service';
import { Repository } from 'typeorm';
import { OrganizationImageCreateDto } from '../domain/dto/image.create.dto';
import { OrganizationImageModel } from '../domain/image.entity';
import { OrganizationImageModule } from '../image.module';

@Injectable()
export class OrganizationImageService {
  constructor(
    @InjectRepository(OrganizationImageModel)
    private repository: Repository<OrganizationImageModel>,
    @Inject(forwardRef(() => OrganizationService))
    private service: OrganizationService,
  ) {}

  findAll(): Promise<OrganizationImageModule[]> {
    return this.repository.find();
  }

  findById(id: string): Promise<OrganizationImageModel> {
    return this.repository.findOne(id);
  }

  async create(file, info: OrganizationImageCreateDto) {
    const organization = await this.service.findById(info.organization);

    if (organization === undefined) {
      throw new NotFoundException('Organization not found.');
    }

    const details = {
      file: file.buffer,
      type: file.mimetype,
      organizationId: info.organization,
    };

    const image = await this.repository.create(details);

    return this.repository.save(image);
  }
}
