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

type MatchesByBU = Partial<Record<Job.BusinessUnit, Job.Match[]>>;

const groupedByBU = (jobMatches: Job.MatchWithBU[]): MatchesByBU => {
  const matchesByBU: MatchesByBU = {};
  jobMatches.forEach((job) => {
    const bu = job.business_unit;
    matchesByBU[bu] =
      matchesByBU[bu] !== undefined ? matchesByBU[bu].concat([job]) : [job];
  });
  return matchesByBU;
};

type MatchesByStage = Partial<Record<Job.StageName, Job.Match[]>>;

const groupedByStage = (jobMatches: Job.MatchWithBU[]): MatchesByStage => {
  const matchesByStage: MatchesByStage = {};
  jobMatches.forEach((job) => {
    const stage = job.stage_name;
    matchesByStage[stage] =
      matchesByStage[stage] !== undefined
        ? matchesByStage[stage].concat([job])
        : [job];
  });
  return matchesByStage;
};

type SummedByStage = Record<Job.StageName, number>;

const summedByStage = (xs: Job.Match[]): Partial<SummedByStage> => {
  const byStage: Partial<SummedByStage> = {};
  return xs.reduce((acc: Partial<SummedByStage>, match: Job.Match) => {
    const stage = match.stage_name;
    const currentCount = acc[stage] || 0;
    const newCount = currentCount + 1;
    return { ...acc, [stage]: newCount };
  }, byStage);
};

type MessagesByBU = Partial<Record<Job.BusinessUnit, Partial<SummedByStage>>>;

export const run = async () => {
  const matches = await getAllMatches();
  const matchesWithBU = matches.map((job) => ({
    ...job,
    business_unit: BUSINESS_UNITS[rand(BUSINESS_UNITS.length)],
  }));
  const matchesByBU: MatchesByBU = groupedByBU(matchesWithBU);
  const buList = keys(matchesByBU);
  const messagesByBU: MessagesByBU = {};
  buList.forEach((bu) => {
    const matches = matchesByBU[bu];
    if (matches) {
      messagesByBU[bu] = summedByStage(matches);
    }
  });
  const message = JSON.stringify(messagesByBU);
  console.log(`${LOG_CTX} Found these BUs: ${Object.keys(matchesByBU)}`);
  await postToSlack(message);
};
