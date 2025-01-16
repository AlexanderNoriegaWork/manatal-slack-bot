import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleChatMessage } from "../lib/manatal-slack-integration";

/*
const logUnknownError = (msg: string, e: unknown) => {
  console.error(msg, e instanceof Error ? e.message : e);
};
*/

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).send(challenge);
}
