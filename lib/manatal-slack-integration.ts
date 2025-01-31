import { getAllMatches } from "./manatal";
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

type JobsByBU = Partial<Record<Job.BusinessUnit, Job.Match[]>>;

const groupedByBU = (jobMatches: Job.MatchWithBU[]): JobsByBU => {
  const matchesByBU: JobsByBU = {};
  jobMatches.forEach((job) => {
    const bu = job.business_unit;
    matchesByBU[bu] =
      matchesByBU[bu] !== undefined ? matchesByBU[bu].concat([job]) : [job];
  });
  return matchesByBU;
};

export const run = async () => {
  const matches = await getAllMatches();
  const matchesWithBU = matches.map((job) => ({
    ...job,
    business_unit: BUSINESS_UNITS[rand(BUSINESS_UNITS.length)],
  }));
  const matchesByBU: JobsByBU = groupedByBU(matchesWithBU);
  const bus = keys(matchesByBU);
  const message: string = bus.reduce((acc: string, bu: Job.BusinessUnit) => {
    const matches = matchesByBU[bu];
    if (!matches) {
      return acc;
    } else {
      const formatted = matches.map(formatMatch).join("\n\n");
      return acc + `*${bu.toUpperCase()}*\n` + formatted;
    }
  }, "");
  console.log(`${LOG_CTX} Found these BUs: ${Object.keys(matchesByBU)}`);
  await postToSlack(message);
};
