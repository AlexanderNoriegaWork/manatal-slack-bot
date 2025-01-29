declare namespace NodeJS {
  interface ProcessEnv {
    SLACK_BOT_TOKEN: string;
    SLACK_CHANNEL_ID: string;
    AZURE_SQL_HOST: string;
    AZURE_SQL_DATABASE: string;
    AZURE_SQL_USERNAME: string;
    AZURE_SQL_PASSWORD: string;
    AZURE_SQL_JOBS_VIEW: string;
    AZURE_SQL_START_DATE: string;
  }
}
