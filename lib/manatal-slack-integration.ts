import { getRecruitmentInfo } from "./manatal";
import { postToSlack } from "./slack";

const LOG_CTX = "[lib/manatal-slack-integration]" as const;
const BUSINESS_UNITS: Job.BusinessUnit[] = [
  "ALL",
  "BU 1",
  "BU 2",
  "BU 3",
  "BU 4",
  "BU 5",
] as const;

const formatMatch = (job: Job.Match): string => {
  const bu = job.business_unit;
  const stage: Job.StageName = job.stage_name;
  const stageIcon = stage === "Hired" ? ":white_check_mark:" : "";
  return `(${bu}) *${job.position}*\n${job.candidate} - ${stage} ${stageIcon}`;
};

const rand = (n: number) => Math.floor(Math.random() * n);

const keys = Object.keys as <T>(o: T) => Extract<keyof T, string>[];

export const run = async () => {
  const r = await getRecruitmentInfo();
  const rWithBU = r.map((job) => ({
    ...job,
    business_unit: BUSINESS_UNITS[rand(BUSINESS_UNITS.length)],
  }));
  const dict: Partial<Record<Job.BusinessUnit, Job.Match[]>> = {};
  rWithBU.forEach((job) => {
    const bu = job.business_unit;
    dict[bu] = dict[bu] !== undefined ? dict[bu].concat([job]) : [job];
  });
  const bus = keys(dict);
  const message: string = bus.reduce((acc: string, bu: Job.BusinessUnit) => {
    const jobs = dict[bu];
    if (!jobs) {
      return acc;
    } else {
      const formatted = jobs.map(formatMatch).join("\n\n");
      return acc + `*${bu.toUpperCase()}*\n` + formatted;
    }
  }, "");
  console.log(`${LOG_CTX} Found these BUs: ${Object.keys(dict)}`);
  await postToSlack(message);
};
