import { IsNotEmpty } from 'class-validator';

export class OrganizationFindDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  id: string;
}
