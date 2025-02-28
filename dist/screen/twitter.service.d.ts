import { HttpService } from '@nestjs/axios';
export declare class TwitterService {
    private readonly httpService;
    private readonly API_URL;
    private readonly bearerToken;
    private isRateLimited;
    private rateLimitResetTime;
    private readonly MAX_RETRIES;
    private readonly RETRY_DELAY;
    constructor(httpService: HttpService);
    private delay;
    private waitForRateLimit;
    private handleRateLimit;
    getLatestTweet(username: string, retryCount?: number): Promise<string>;
}
