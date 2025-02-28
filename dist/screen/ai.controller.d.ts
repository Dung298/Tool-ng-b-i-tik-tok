import { AIService } from './ai.service';
import { GenerateVideoDto } from './dto/generate-video.dto';
export declare class AIController {
    private readonly aiService;
    constructor(aiService: AIService);
    generateVideo(generateVideoDto: GenerateVideoDto): Promise<string>;
}
