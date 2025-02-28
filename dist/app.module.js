"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const schedule_1 = require("@nestjs/schedule");
const axios_1 = require("@nestjs/axios");
const twitter_service_1 = require("./screen/twitter.service");
const ai_service_1 = require("./screen/ai.service");
const tiktok_service_1 = require("./screen/tiktok.service");
const twitter_controller_1 = require("./screen/twitter.controller");
const ai_controller_1 = require("./screen/ai.controller");
const tiktok_controller_1 = require("./screen/tiktok.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [schedule_1.ScheduleModule.forRoot(), axios_1.HttpModule],
        controllers: [app_controller_1.AppController, twitter_controller_1.TwitterController, ai_controller_1.AIController, tiktok_controller_1.TikTokController],
        providers: [app_service_1.AppService, twitter_service_1.TwitterService, ai_service_1.AIService, tiktok_service_1.TikTokService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map