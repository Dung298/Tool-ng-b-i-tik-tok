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
exports.TwitterService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const axios_2 = require("axios");
let TwitterService = class TwitterService {
    constructor(httpService) {
        this.httpService = httpService;
        this.API_URL = 'https://api.twitter.com/2';
        this.bearerToken = process.env.TWITTER_BEARER_TOKEN;
        this.isRateLimited = false;
        this.rateLimitResetTime = null;
        this.MAX_RETRIES = 3;
        this.RETRY_DELAY = 5000;
        console.log('\n=== Twitter Service Status ===');
        console.log('Service: Initialized');
        console.log('Bearer Token:', this.bearerToken ? 'Available ✅' : 'Missing ❌');
        console.log('============================\n');
    }
    async delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async waitForRateLimit() {
        if (this.isRateLimited && this.rateLimitResetTime) {
            const now = Date.now();
            const resetTime = this.rateLimitResetTime * 1000;
            if (now < resetTime) {
                const waitTime = resetTime - now + 1000;
                const waitSeconds = Math.ceil(waitTime / 1000);
                console.log(`⏳ Rate limited. Waiting ${waitSeconds} seconds...`);
                await this.delay(waitTime);
            }
            this.isRateLimited = false;
            this.rateLimitResetTime = null;
        }
    }
    handleRateLimit(headers) {
        const remaining = parseInt(headers['x-rate-limit-remaining']);
        const resetTime = parseInt(headers['x-rate-limit-reset']);
        if (remaining < 2) {
            this.isRateLimited = true;
            this.rateLimitResetTime = resetTime;
            const resetDate = new Date(resetTime * 1000);
            console.log(`\n⚠️ Rate limit warning:`);
            console.log(`Remaining calls: ${remaining}`);
            console.log(`Reset time: ${resetDate.toLocaleString()}\n`);
        }
    }
    async getLatestTweet(username, retryCount = 0) {
        try {
            console.log('\n🔄 Starting Twitter API Request');
            console.log('Username:', username);
            console.log('Attempt:', retryCount + 1);
            await this.waitForRateLimit();
            const userUrl = `${this.API_URL}/users/by/username/${username}`;
            console.log('\n📡 Fetching user data...');
            const userResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(userUrl, {
                headers: { Authorization: `Bearer ${this.bearerToken}` },
            }));
            if (!userResponse.data?.data) {
                console.log('❌ User not found');
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            const { id, name } = userResponse.data.data;
            console.log('✅ User found:', { id, name });
            const tweetsUrl = `${this.API_URL}/users/${id}/tweets`;
            console.log('\n📡 Fetching tweets...');
            const tweetsResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(tweetsUrl, {
                params: {
                    'tweet.fields': 'created_at',
                    max_results: 5,
                },
                headers: { Authorization: `Bearer ${this.bearerToken}` },
            }));
            const headers = tweetsResponse.headers;
            this.handleRateLimit(headers);
            if (!tweetsResponse.data?.data?.[0]) {
                console.log('ℹ️ No tweets found');
                return 'No tweets found';
            }
            const tweet = tweetsResponse.data.data[0];
            console.log('\n✅ Latest tweet found:');
            console.log('Text:', tweet.text);
            console.log('Created at:', new Date(tweet.created_at).toLocaleString());
            console.log('\n=== Request Complete ===\n');
            return tweet.text;
        }
        catch (error) {
            if (error instanceof axios_2.AxiosError) {
                console.log('\n❌ Twitter API Error:');
                console.log('Status:', error.response?.status);
                console.log('Data:', JSON.stringify(error.response?.data, null, 2));
                if (error.response?.status === 429) {
                    this.isRateLimited = true;
                    const resetTime = parseInt(error.response.headers['x-rate-limit-reset']);
                    this.rateLimitResetTime = resetTime;
                    if (retryCount < this.MAX_RETRIES) {
                        console.log(`\n🔄 Retrying (${retryCount + 1}/${this.MAX_RETRIES})...`);
                        await this.delay(this.RETRY_DELAY);
                        return this.getLatestTweet(username, retryCount + 1);
                    }
                    throw new common_1.HttpException('Rate limit exceeded. Please try again later.', common_1.HttpStatus.TOO_MANY_REQUESTS);
                }
                const twitterError = error.response?.data;
                const errorMessage = twitterError?.data?.detail || error.message;
                throw new common_1.HttpException(errorMessage || 'Twitter API error', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            console.error('Unexpected error:', error);
            throw new common_1.HttpException('An unexpected error occurred', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.TwitterService = TwitterService;
exports.TwitterService = TwitterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], TwitterService);
//# sourceMappingURL=twitter.service.js.map