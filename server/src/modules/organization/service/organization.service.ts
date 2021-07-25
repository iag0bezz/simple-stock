import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationCreateDto } from '../domain/dto/organization.create.dto';
import { OrganizationDeleteDto } from '../domain/dto/organization.delete.dto';
import { OrganizationFindDto } from '../domain/dto/organization.find.dto';
import { OrganizationModel } from '../domain/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(OrganizationModel)
    private repository: Repository<OrganizationModel>,
  ) {}

  findAll(userId: string): Promise<OrganizationModel[]> {
    return this.repository.find({ where: { userId } });
  }

  findById(id: string): Promise<OrganizationModel> {
    return this.repository.findOne(id);
  }

  find(details: OrganizationFindDto): Promise<OrganizationModel> {
    return this.repository.findOne({
      id: details.id,
      userId: details.userId,
    });
  }

  async create(userId: string, details: OrganizationCreateDto) {
    let organization = await this.repository.findOne({
      name: details.name,
      userId: userId,
    });

    if (organization !== undefined) {
      throw new HttpException(
        'Organization already exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    organization = await this.repository.create({ name: details.name, userId });

    return this.repository.save(organization);
  }

  async delete(details: OrganizationDeleteDto): Promise<OrganizationModel> {
    const organization = await this.findById(details.id);

    if (organization === undefined) {
      throw new NotFoundException('Organization not found');
    }

    if (organization.userId !== details.userId) {
      throw new UnauthorizedException('You are not allowed to delete this.');
    }

    this.repository.delete(organization.id);

    return organization;
  }
}
