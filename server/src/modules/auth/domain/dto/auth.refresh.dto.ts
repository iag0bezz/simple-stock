import { IsNotEmpty } from 'class-validator';

export class AuthRefreshDto {
  @IsNotEmpty()
  refreshToken: string;
}
