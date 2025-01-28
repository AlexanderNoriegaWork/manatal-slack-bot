import { getRecruitmentInfo } from "./manatal";
import { postToSlack } from "./slack";

const LOG_CTX = "[lib/manatal-slack-integration]" as const;

const formatMatch = (job: Job.Match): string => {
  return `*${job.position}*\n${job.candidate} - ${job.stage_name}`;
};

export const run = async () => {
  const r = await getRecruitmentInfo();
  const dict: Record<Job.BusinessUnit | "all", Job.Match[]> = {};
  r.forEach((job) => {
    const bu = job.business_unit || "all";
    dict[bu] = dict[bu] !== undefined ? dict[bu].concat([job]) : [job];
  });
  const message: string = Object.keys(dict).reduce(
    (acc: string, bu: Job.BusinessUnit | "all") => {
      const formatted = dict[bu].map(formatMatch).join("\n\n");
      return acc + `*${bu.toUpperCase()}*\n` + formatted;
    },
    "",
  );
  console.log(`${LOG_CTX} Found these BUs: ${Object.keys(dict)}`);
  // const formatted = r.map(formatMatch).join("\n\n");
  await postToSlack(message);
};
