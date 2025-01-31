import { getAllMatches } from "./manatal";
import { ChannelID, postToSlack } from "./slack";

const LOG_CTX = "[lib/manatal-slack-integration]" as const;
const BUSINESS_UNITS: Job.BusinessUnit[] = [
  "BU 1",
  "BU 2",
  "BU 3",
  "BU 4",
  "BU 5",
  "BU 6",
  "BU 7",
  "BU 8",
  "BU 9",
] as const;

const formatMatchWithCandidateInfo = (job: Job.Match): string => {
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

type SlackChannelsConfig = Record<Job.BusinessUnit, ChannelID>;

declare const SlackChannelConfigSymbol: unique symbol;

type ValidSlackChannelsConfig = SlackChannelsConfig & {
  [SlackChannelConfigSymbol]: never;
};

const isValidSlackChannelConfig = (
  x: unknown,
): x is ValidSlackChannelsConfig => {
  if (x !== null && typeof x === "object") {
    const xs = Object.entries(x);
    return xs.every(([k, v]) => {
      return (
        typeof k === "string" &&
        k.trim() !== "" &&
        typeof v === "string" &&
        v.trim() !== ""
      );
    });
  } else {
    return false;
  }
};

const messagesByBU = (matchesByBU: MatchesByBU): MessagesByBU => {
  const buList = keys(matchesByBU);
  const byBU: MessagesByBU = {};
  buList.forEach((bu) => {
    const matches = matchesByBU[bu];
    if (matches) {
      byBU[bu] = summedByStage(matches);
    }
  });
  return byBU;
};

const { SLACK_CHANNELS } = process.env;

const dispatchMessages = async (
  messages: MessagesByBU,
  config: ValidSlackChannelsConfig,
) => {
  return await Promise.all(
    keys(messages).map(async (bu) => {
      const channelID = config[bu];
      const message = messages[bu];
      if (message !== undefined) {
        await postToSlack(JSON.stringify(message), channelID);
      } else {
        console.log(`${LOG_CTX} No channel ID found for BU ${bu}`);
      }
    }),
  );
};

export const run = async () => {
  const matches = await getAllMatches();
  const matchesWithBU = matches.map((job) => ({
    ...job,
    business_unit: BUSINESS_UNITS[rand(BUSINESS_UNITS.length)],
  }));
  const matchesByBU: MatchesByBU = groupedByBU(matchesWithBU);
  const messagesGroupedByBU = messagesByBU(matchesByBU);
  try {
    const slackChannelsConfig = JSON.parse(SLACK_CHANNELS);
    if (isValidSlackChannelConfig(slackChannelsConfig)) {
      dispatchMessages(messagesGroupedByBU, slackChannelsConfig);
    } else {
      throw Error(
        `Parsed but invalid SLACK_CHANNELS data: ${slackChannelsConfig}`,
      );
    }
  } catch (e) {
    console.log(
      `${LOG_CTX} Could not parse SLACK_CHANNELS environment variable:`,
      SLACK_CHANNELS,
    );
  }
};
