import { getRecruitmentInfo } from "./manatal";
import { postToSlack } from "./slack";

const LOG_CTX = "[lib/manatal-slack-integration]" as const;

const formatMatch = (job: Job.Match): string => {
  return `*${job.position}*\n${job.candidate} - ${job.stage_name}`;
};

export const run = async () => {
  const r = await getRecruitmentInfo();
  const formatted = r.map(formatMatch).join("\n\n");
  await postToSlack(formatted);
};
