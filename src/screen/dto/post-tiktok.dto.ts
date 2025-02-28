import { IsString, IsNotEmpty } from 'class-validator';

export class PostTikTokDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
