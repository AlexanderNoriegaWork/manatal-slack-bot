import axios from "axios";
import { type AxiosResponse } from "axios";

const {
  SLACK_BOT_TOKEN,
  SLACK_CHANNEL_ID,
} = process.env;

export const postToSlack = async (
  payload: string,
): Promise<AxiosResponse<any, any>> => {
  throw new Error("NOT IMPLEMENTED");
}
