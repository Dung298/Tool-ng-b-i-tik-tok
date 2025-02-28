import { TwitterService } from './twitter.service';
export declare class TwitterController {
    private readonly twitterService;
    constructor(twitterService: TwitterService);
    getLatestTweet(username: string): Promise<string>;
}
