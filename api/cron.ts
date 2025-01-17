import type { VercelRequest, VercelResponse } from "@vercel/node";
import { run } from "../lib/manatal-slack-integration";

/*
const logUnknownError = (msg: string, e: unknown) => {
  console.error(msg, e instanceof Error ? e.message : e);
};
*/

const { SLACK_CHANNEL_ID } = process.env;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // random comment
  await run();
  res
    .status(200)
    .send(
      `NOT implemented: Send message to slack channel: ${SLACK_CHANNEL_ID}`,
    );
}
