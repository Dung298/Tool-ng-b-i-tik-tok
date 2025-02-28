import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as dotenv from 'dotenv';

dotenv.config();

interface RunwayMLResponse {
  video_url: string;
}

@Injectable()
export class AIService {
  private readonly API_URL = 'https://text-to-video-generation.p.rapidapi.com';

  constructor(private readonly httpService: HttpService) {}

  async generateVideo(text: string): Promise<string | undefined> {
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

      const response = await firstValueFrom(
        this.httpService.post<RunwayMLResponse>(`${this.API_URL}/generate`, requestBody, {
          headers: { 
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'text-to-video-generation.p.rapidapi.com',
            'Content-Type': 'application/json',
          },
        }),
      );

      console.log('✅ Video generated successfully');
      console.log('URL:', response.data.video_url);
      console.log('=== Request Complete ===\n');

      return response.data.video_url;
    } catch (error: any) {
      console.error('\n❌ RunwayML API Error:');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Message:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('Error:', error.message);
      }
      console.error('=== Error Details ===\n');
      return undefined;
    }
  }
}
