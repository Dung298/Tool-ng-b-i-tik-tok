import { Controller, Post, Body } from '@nestjs/common';
import { TikTokService } from './tiktok.service';
import { PostTikTokDto } from './dto/post-tiktok.dto';

@Controller('tiktok')
export class TikTokController {
  constructor(private readonly tiktokService: TikTokService) {}

  @Post('post')
  async postToTikTok(@Body() postTikTokDto: PostTikTokDto) {
    return this.tiktokService.postToTikTok(postTikTokDto.content);
  }
}
