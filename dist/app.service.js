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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const twitter_service_1 = require("./screen/twitter.service");
const ai_service_1 = require("./screen/ai.service");
const tiktok_service_1 = require("./screen/tiktok.service");
let AppService = class AppService {
    constructor(twitterService, aiService, tiktokService) {
        this.twitterService = twitterService;
        this.aiService = aiService;
        this.tiktokService = tiktokService;
    }
    getHello() {
        return 'Hello World!';
    }
    async processContent() {
        try {
            const tweet = await this.twitterService.getLatestTweet('example_user');
            if (!tweet) {
                console.log('No tweet found');
                return;
            }
            const videoUrl = await this.aiService.generateVideo(tweet);
            if (!videoUrl) {
                console.log('Failed to generate video');
                return;
            }
            const posted = await this.tiktokService.postToTikTok(tweet);
            if (posted) {
                console.log('Successfully posted to TikTok');
            }
            else {
                console.log('Failed to post to TikTok');
            }
        }
        catch (error) {
            console.error('Error in content processing:', error);
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [twitter_service_1.TwitterService,
        ai_service_1.AIService,
        tiktok_service_1.TikTokService])
], AppService);
//# sourceMappingURL=app.service.js.map