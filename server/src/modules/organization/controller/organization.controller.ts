import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guard/auth.guard';
import { OrganizationCreateDto } from '../domain/dto/organization.create.dto';
import { OrganizationService } from '../service/organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private service: OrganizationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() details: OrganizationCreateDto, @Req() request) {
    const { id } = request.user;

    return await this.service.create(id, details);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') organizationId, @Req() request) {
    const { id } = request.user;

    return await this.service.delete({ id: organizationId, userId: id });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() request) {
    const { id } = request.user;

    return await this.service.findAll(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async find(@Param('id') organizationId: string, @Req() request) {
    const { id } = request.user;

    const organization = await this.service.find({
      id: organizationId,
      userId: id,
    });

    if (organization === undefined) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }
}
