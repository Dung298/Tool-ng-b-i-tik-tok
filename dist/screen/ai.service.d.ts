import { HttpService } from '@nestjs/axios';
export declare class AIService {
    private readonly httpService;
    private readonly API_URL;
    constructor(httpService: HttpService);
    generateVideo(text: string): Promise<string | undefined>;
}
