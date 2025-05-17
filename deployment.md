# Deploying to Deno Deploy

This guide explains how to deploy your Telegram bot to Deno Deploy.

## Prerequisites

1. A [Deno Deploy](https://deno.com/deploy) account
2. Your Telegram Bot Token
3. Your project code in a GitHub repository

## Deployment Steps

### 1. Set Up GitHub Repository

Push your code to a GitHub repository if you haven't already done so.

### 2. Create a New Project in Deno Deploy

- Go to [Deno Deploy dashboard](https://dash.deno.com/projects)
- Click "New Project"
- Choose "Deploy from GitHub" and select your repository
- Set the entry point to "main.ts"

### 3. Configure Environment Variables

In your Deno Deploy project settings, add these environment variables:

- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
- `ENV`: Set to "production"
- `WEBHOOK_URL`: Your Deno Deploy app URL (e.g., https://your-project.deno.dev)
- `DROP_PENDING_UPDATES`: Set to "true" if you want to ignore updates that arrived while bot was offline

### 4. Deploy

After setting up environment variables, deploy your project. Deno Deploy will automatically build and deploy your application.

### 5. Set Up Telegram Webhook

Your bot will automatically set up the webhook when it starts. The webhook URL will be:
`https://your-project.deno.dev/telegram-webhook`

### 6. Verify Deployment

Visit `https://your-project.deno.dev/health` to verify that your bot is running correctly.

## Troubleshooting

- **Webhook issues**: Make sure your `WEBHOOK_URL` doesn't have a trailing slash
- **Bot not responding**: Check the logs in Deno Deploy dashboard
- **Environment variables**: Ensure all required environment variables are set correctly

## Local Development

Run the bot locally in development mode:

```bash
deno task dev
```

This will start the bot using long polling instead of webhooks.
