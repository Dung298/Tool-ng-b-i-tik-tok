import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateVideoDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
