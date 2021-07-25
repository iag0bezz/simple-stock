import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrganizationImageCreateDto } from '../domain/dto/image.create.dto';
import { OrganizationImageService } from '../service/image.service';

@Controller('organization/image')
export class OrganizationImageController {
  constructor(private service: OrganizationImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file,
    @Res() res,
    @Req() req,
    @Body() details: OrganizationImageCreateDto,
  ) {
    const image = await this.service.create(file, details);

    const host = req.get('host');
    image.url = `http://${host}/organization/image/${image.id}`;

    return res.send({
      id: image.id,
      date: image.date,
      url: image.url,
      type: image.type,
    });
  }

  @Get(':id')
  async find(@Res() res, @Param('id') id) {
    const image = await this.service.findById(id);

    if (image === undefined) {
      throw new NotFoundException('Image does not exists!');
    }

    res.setHeader('Content-Type', image.type);
    return res.send(image.file);
  }
}
