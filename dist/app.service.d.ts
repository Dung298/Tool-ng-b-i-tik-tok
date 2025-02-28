import { TwitterService } from './screen/twitter.service';
import { AIService } from './screen/ai.service';
import { TikTokService } from './screen/tiktok.service';
export declare class AppService {
    private readonly twitterService;
    private readonly aiService;
    private readonly tiktokService;
    constructor(twitterService: TwitterService, aiService: AIService, tiktokService: TikTokService);
    getHello(): string;
    processContent(): Promise<void>;
}
