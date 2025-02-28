import { TikTokService } from './tiktok.service';
import { PostTikTokDto } from './dto/post-tiktok.dto';
export declare class TikTokController {
    private readonly tiktokService;
    constructor(tiktokService: TikTokService);
    postToTikTok(postTikTokDto: PostTikTokDto): Promise<any>;
}
