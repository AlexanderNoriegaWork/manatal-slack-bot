import { WebClient } from "@slack/web-api";

const { SLACK_BOT_TOKEN, SLACK_CHANNEL_ID } = process.env;

const slackClient = new WebClient(SLACK_BOT_TOKEN);

const LOG_CTX = "[lib/slack]";

export const postToSlack = async (text: string): Promise<void> => {
  console.log(`${LOG_CTX} Try to post message to slack`);
  try {
    await slackClient.chat.postMessage({ channel: SLACK_CHANNEL_ID, text });
    console.log(`${LOG_CTX} Message posted successfully`);
  } catch (e: any) {
    console.log(`${LOG_CTX} Could not post slack message`, JSON.stringify(e));
  }
};
