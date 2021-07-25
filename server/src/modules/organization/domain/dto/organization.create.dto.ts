import { IsNotEmpty } from 'class-validator';

export class OrganizationCreateDto {
  @IsNotEmpty()
  name: string;
}
