import { Injectable } from '@nestjs/common';
import { TwitterService } from './screen/twitter.service';
import { AIService } from './screen/ai.service';
import { TikTokService } from './screen/tiktok.service';

@Injectable()
export class AppService {
  constructor(
    private readonly twitterService: TwitterService,
    private readonly aiService: AIService,
    private readonly tiktokService: TikTokService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async processContent(): Promise<void> {
    try {
      // Get latest tweet
      const tweet = await this.twitterService.getLatestTweet('example_user');
      if (!tweet) {
        console.log('No tweet found');
        return;
      }

      // Generate video from tweet
      const videoUrl = await this.aiService.generateVideo(tweet);
      if (!videoUrl) {
        console.log('Failed to generate video');
        return;
      }

      // Post to TikTok
      const posted = await this.tiktokService.postToTikTok(tweet);
      if (posted) {
        console.log('Successfully posted to TikTok');
      } else {
        console.log('Failed to post to TikTok');
      }
    } catch (error) {
      console.error('Error in content processing:', error);
    }
  }
}
