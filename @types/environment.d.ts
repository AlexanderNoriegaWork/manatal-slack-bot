declare namespace NodeJS {
  interface ProcessEnv {
    SLACK_BOT_TOKEN: string;
    SLACK_CHANNEL_ID: string;
    MANATAL_API_KEY: string;
    MANATAL_API_BASE_URL: string;
  }
}
