import { Controller, Get, Param } from '@nestjs/common';
import { TwitterService } from './twitter.service';

@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Get(':username')
  async getLatestTweet(@Param('username') username: string): Promise<string> {
    return this.twitterService.getLatestTweet(username);
  }
}
