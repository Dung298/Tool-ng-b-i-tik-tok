import { Controller, Post, Body } from '@nestjs/common';
import { AIService } from './ai.service';
import { GenerateVideoDto } from './dto/generate-video.dto';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('generate-video')
  async generateVideo(@Body() generateVideoDto: GenerateVideoDto) {
    return this.aiService.generateVideo(generateVideoDto.text);
  }
}
