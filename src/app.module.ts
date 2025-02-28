import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { TwitterService } from './screen/twitter.service';
import { AIService } from './screen/ai.service';
import { TikTokService } from './screen/tiktok.service';
import { TwitterController } from './screen/twitter.controller';
import { AIController } from './screen/ai.controller';
import { TikTokController } from './screen/tiktok.controller';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule],
  controllers: [AppController, TwitterController, AIController, TikTokController],
  providers: [AppService, TwitterService, AIService, TikTokService],
})
export class AppModule {}
