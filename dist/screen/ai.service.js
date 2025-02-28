"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const dotenv = require("dotenv");
dotenv.config();
let AIService = class AIService {
    constructor(httpService) {
        this.httpService = httpService;
        this.API_URL = 'https://text-to-video-generation.p.rapidapi.com';
    }
    async generateVideo(text) {
        const apiKey = process.env.RUNWAYML_API_KEY;
        const requestBody = {
            prompt: text,
            negative_prompt: '',
            width: '576',
            height: '320',
            num_inference_steps: '30',
            guidance_scale: '20',
            num_frames: '24',
        };
        try {
            console.log('\n=== RunwayML API Request ===');
            console.log('Prompt:', text);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.API_URL}/generate`, requestBody, {
                headers: {
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': 'text-to-video-generation.p.rapidapi.com',
                    'Content-Type': 'application/json',
                },
            }));
            console.log('✅ Video generated successfully');
            console.log('URL:', response.data.video_url);
            console.log('=== Request Complete ===\n');
            return response.data.video_url;
        }
        catch (error) {
            console.error('\n❌ RunwayML API Error:');
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Message:', JSON.stringify(error.response.data, null, 2));
            }
            else {
                console.error('Error:', error.message);
            }
            console.error('=== Error Details ===\n');
            return undefined;
        }
    }
};
exports.AIService = AIService;
exports.AIService = AIService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], AIService);
//# sourceMappingURL=ai.service.js.map