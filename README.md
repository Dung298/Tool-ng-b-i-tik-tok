# Tool-ng-b-i-tik-tok

A NestJS application that integrates with Twitter and TikTok APIs to fetch tweets and generate videos.

## Legal

- [Terms of Service](public/terms-of-service.md)
- [Privacy Policy](public/privacy-policy.md)

## Features

- Fetch latest tweets from Twitter
- Generate videos using AI
- Upload videos to TikTok
- Rate limit handling
- Error logging

## Installation

```bash
$ npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Twitter API credentials
TWITTER_BEARER_TOKEN=your_twitter_token

# TikTok API credentials
TIKTOK_ACCESS_TOKEN=your_tiktok_token

# RunwayML API credentials
RUNWAYML_API_KEY=your_runwayml_key
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Endpoints

### Twitter
- `GET /twitter/:username` - Get latest tweet from a user

### AI
- `POST /ai/generate-video` - Generate video from text

### TikTok
- `POST /tiktok/upload` - Upload video to TikTok

## License

This project is MIT licensed.
