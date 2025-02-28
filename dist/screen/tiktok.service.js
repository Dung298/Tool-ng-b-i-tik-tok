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
exports.TikTokService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const dotenv = require("dotenv");
const FormData = require("form-data");
const fs = require("fs");
dotenv.config();
let TikTokService = class TikTokService {
    constructor(httpService) {
        this.httpService = httpService;
        this.API_URL = 'https://open.tiktokapis.com/v2';
        this.accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    }
    async uploadVideo(videoPath, description) {
        try {
            console.log('\n=== TikTok Video Upload ===');
            console.log('Video:', videoPath);
            console.log('Description:', description);
            const formData = new FormData();
            formData.append('video', fs.createReadStream(videoPath));
            formData.append('description', description);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.API_URL}/video/upload/`, formData, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    ...formData.getHeaders(),
                },
            }));
            if (response.data.error) {
                console.error('❌ Upload failed:', response.data.error.message);
                return false;
            }
            console.log('✅ Video uploaded successfully');
            console.log('Video ID:', response.data.data.video_id);
            console.log('Share ID:', response.data.data.share_id);
            console.log('=== Upload Complete ===\n');
            return true;
        }
        catch (error) {
            console.error('\n❌ TikTok API Error:');
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Message:', JSON.stringify(error.response.data, null, 2));
            }
            else {
                console.error('Error:', error.message);
            }
            console.error('=== Error Details ===\n');
            return false;
        }
    }
};
exports.TikTokService = TikTokService;
exports.TikTokService = TikTokService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], TikTokService);
//# sourceMappingURL=tiktok.service.js.map