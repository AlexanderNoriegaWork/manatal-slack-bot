import { WebClient } from "@slack/web-api";

const { SLACK_BOT_TOKEN } = process.env;

const slackClient = new WebClient(SLACK_BOT_TOKEN);

const LOG_CTX = "[lib/slack]";

export type ChannelID = string;

export const postToSlack = async (
  text: string,
  channel: ChannelID,
): Promise<void> => {
  console.log(`${LOG_CTX} Try to post message to slack`);
  try {
    await slackClient.chat.postMessage({ channel, text });
    console.log(`${LOG_CTX} Message posted successfully`);
  } catch (e: any) {
    console.log(`${LOG_CTX} Could not post slack message`, JSON.stringify(e));
  }
};
