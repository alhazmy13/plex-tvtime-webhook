# Plex TvTime Webhook
Sync Plex with TvTime using Plex WebHook.

## How does it work with Plex Pass?
When you watch 90% of the video on Plex, Plex server will send a ping to the Webhook URL that you watched 90% of the video and the service will mark this video as watched in your TvTime profile.

This works for TV Show and Anime episodes. Connects to your personal Plex account and it does not matter on which Plex server you’re watching.

PS: Requires an active Plex Pass and Plex Server running v1.3.4 or newer.

## How to run Project

Install dependencies
```bash
npm install
```

Run project
```bash
npm start
```

## Configuration
Update `src\config.ts` with your own configuration or use environment variable

## Docker

Build docker image
```
docker build -t plex_tvtime_webhook .
```

Run image 

```bash
docker run -d -e TVTIME_SYMFONY=YOUR_KEY -e TVTIME_TVST_REMEMBER=YOUR_KEY -p 80:3000 --name plex_tvtime_webhook plex_tvtime_webhook
```


## How to us it:
1. Copy the Webhook URL:
```
YOUR_WebHook_BaseUrl/tvtime?user=YOUR_PLEX_USERNAME
```
2. Open Plex Webhooks settings
3. Click “Add  Webhook” on the Plex website.
4. Paste the Webhook URL and click Save.
You’re all done! Now watch an episode, and Plex will mark it as watched on Tvtime.


## Don't have a Plex Pass?

The easiest way is to use the Webhook  with Plex Pass. But if you don't have a Plex Pass you can use [PlexTvtimeSync](https://github.com/Paypito/plextvtimesync) insted of this project.