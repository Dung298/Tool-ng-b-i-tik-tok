import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

interface TwitterUser {
  data: {
    id: string;
    username: string;
    name: string;
  };
}

interface TwitterTweets {
  data: Array<{
    id: string;
    text: string;
    created_at: string;
  }>;
}

interface TwitterError {
  status: number;
  data: {
    detail: string;
  };
}

interface TwitterHeaders {
  'x-rate-limit-remaining': string;
  'x-rate-limit-reset': string;
}

@Injectable()
export class TwitterService {
  private readonly API_URL = 'https://api.twitter.com/2';
  private readonly bearerToken = process.env.TWITTER_BEARER_TOKEN;
  private isRateLimited = false;
  private rateLimitResetTime: number | null = null;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 5000; // 5 seconds

  constructor(private readonly httpService: HttpService) {
    console.log('\n=== Twitter Service Status ===');
    console.log('Service: Initialized');
    console.log('Bearer Token:', this.bearerToken ? 'Available ✅' : 'Missing ❌');
    console.log('============================\n');
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async waitForRateLimit(): Promise<void> {
    if (this.isRateLimited && this.rateLimitResetTime) {
      const now = Date.now();
      const resetTime = this.rateLimitResetTime * 1000;
      if (now < resetTime) {
        const waitTime = resetTime - now + 1000;
        const waitSeconds = Math.ceil(waitTime / 1000);
        console.log(`⏳ Rate limited. Waiting ${waitSeconds} seconds...`);
        await this.delay(waitTime);
      }
      this.isRateLimited = false;
      this.rateLimitResetTime = null;
    }
  }

  private handleRateLimit(headers: TwitterHeaders): void {
    const remaining = parseInt(headers['x-rate-limit-remaining']);
    const resetTime = parseInt(headers['x-rate-limit-reset']);

    if (remaining < 2) {
      this.isRateLimited = true;
      this.rateLimitResetTime = resetTime;
      const resetDate = new Date(resetTime * 1000);
      console.log(`\n⚠️ Rate limit warning:`);
      console.log(`Remaining calls: ${remaining}`);
      console.log(`Reset time: ${resetDate.toLocaleString()}\n`);
    }
  }

  async getLatestTweet(username: string, retryCount = 0): Promise<string> {
    try {
      console.log('\n🔄 Starting Twitter API Request');
      console.log('Username:', username);
      console.log('Attempt:', retryCount + 1);
      
      await this.waitForRateLimit();

      const userUrl = `${this.API_URL}/users/by/username/${username}`;
      console.log('\n📡 Fetching user data...');

      const userResponse = await firstValueFrom(
        this.httpService.get<TwitterUser>(userUrl, {
          headers: { Authorization: `Bearer ${this.bearerToken}` },
        }),
      );

      if (!userResponse.data?.data) {
        console.log('❌ User not found');
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const { id, name } = userResponse.data.data;
      console.log('✅ User found:', { id, name });

      const tweetsUrl = `${this.API_URL}/users/${id}/tweets`;
      console.log('\n📡 Fetching tweets...');

      const tweetsResponse = await firstValueFrom(
        this.httpService.get<TwitterTweets>(tweetsUrl, {
          params: {
            'tweet.fields': 'created_at',
            max_results: 5,
          },
          headers: { Authorization: `Bearer ${this.bearerToken}` },
        }),
      );

      const headers = tweetsResponse.headers as unknown as TwitterHeaders;
      this.handleRateLimit(headers);

      if (!tweetsResponse.data?.data?.[0]) {
        console.log('ℹ️ No tweets found');
        return 'No tweets found';
      }

      const tweet = tweetsResponse.data.data[0];
      console.log('\n✅ Latest tweet found:');
      console.log('Text:', tweet.text);
      console.log('Created at:', new Date(tweet.created_at).toLocaleString());
      console.log('\n=== Request Complete ===\n');

      return tweet.text;

    } catch (error) {
      if (error instanceof AxiosError) {
        console.log('\n❌ Twitter API Error:');
        console.log('Status:', error.response?.status);
        console.log('Data:', JSON.stringify(error.response?.data, null, 2));

        if (error.response?.status === 429) {
          this.isRateLimited = true;
          const resetTime = parseInt(error.response.headers['x-rate-limit-reset'] as string);
          this.rateLimitResetTime = resetTime;
          
          if (retryCount < this.MAX_RETRIES) {
            console.log(`\n🔄 Retrying (${retryCount + 1}/${this.MAX_RETRIES})...`);
            await this.delay(this.RETRY_DELAY);
            return this.getLatestTweet(username, retryCount + 1);
          }

          throw new HttpException(
            'Rate limit exceeded. Please try again later.',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }

        const twitterError = error.response?.data as TwitterError;
        const errorMessage = twitterError?.data?.detail || error.message;
        throw new HttpException(
          errorMessage || 'Twitter API error',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      console.error('Unexpected error:', error);
      throw new HttpException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
