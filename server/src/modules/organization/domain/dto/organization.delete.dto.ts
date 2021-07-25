import { IsNotEmpty } from 'class-validator';

export class OrganizationDeleteDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  userId: string;
}
