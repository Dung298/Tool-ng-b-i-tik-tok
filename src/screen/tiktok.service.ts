import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as dotenv from 'dotenv';
import * as FormData from 'form-data';
import * as fs from 'fs';

dotenv.config();

interface TikTokResponse {
  data: {
    share_id: string;
    video_id: string;
  };
  error: {
    code: number;
    message: string;
  };
}

@Injectable()
export class TikTokService {
  private readonly API_URL = 'https://open.tiktokapis.com/v2';
  private readonly accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  constructor(private readonly httpService: HttpService) {}

  async uploadVideo(videoPath: string, description: string): Promise<boolean> {
    try {
      console.log('\n=== TikTok Video Upload ===');
      console.log('Video:', videoPath);
      console.log('Description:', description);

      // Create form data
      const formData = new FormData();
      formData.append('video', fs.createReadStream(videoPath));
      formData.append('description', description);

      const response = await firstValueFrom(
        this.httpService.post<TikTokResponse>(`${this.API_URL}/video/upload/`, formData, {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            ...formData.getHeaders(),
          },
        })
      );

      if (response.data.error) {
        console.error('❌ Upload failed:', response.data.error.message);
        return false;
      }

      console.log('✅ Video uploaded successfully');
      console.log('Video ID:', response.data.data.video_id);
      console.log('Share ID:', response.data.data.share_id);
      console.log('=== Upload Complete ===\n');

      return true;
    } catch (error: any) {
      console.error('\n❌ TikTok API Error:');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Message:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('Error:', error.message);
      }
      console.error('=== Error Details ===\n');
      return false;
    }
  }
}
