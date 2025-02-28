import { HttpService } from '@nestjs/axios';
export declare class TikTokService {
    private readonly httpService;
    private readonly API_URL;
    private readonly accessToken;
    constructor(httpService: HttpService);
    uploadVideo(videoPath: string, description: string): Promise<boolean>;
}
