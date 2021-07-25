import { IsNotEmpty } from 'class-validator';

export class OrganizationImageCreateDto {
  @IsNotEmpty()
  organization: string;
}
