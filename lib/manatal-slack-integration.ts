import { getRecruitmentInfo } from "./manatal";
import { postToSlack } from "./slack";

const LOG_CTX = "[lib/manatal-slack-integration]" as const;

export const run = async () => {
  const r = await getRecruitmentInfo();
  const formatted = r.map((job) => `${job.candidate} ${job.stage_name}`);
  await postToSlack(JSON.stringify(formatted));
};
