declare namespace NodeJS {
  interface ProcessEnv {
    SLACK_BOT_TOKEN: string;
    SLACK_CHANNEL_ID: string;
    MANATAL_API_KEY: string;
    MANATAL_API_BASE_URL: string;
    AZURE_SQL_HOST: string;
    AZURE_SQL_DATABASE: string;
    AZURE_SQL_USERNAME: string;
    AZURE_SQL_PASSWORD: string;
    AZURE_SQL_JOBS_VIEW: string;
  }
}
