declare namespace Job {
  type Studio =
    | "Engineering Studio"
    | "Data Studio"
    | "Site Reliability Engineering Studio"
    | "Quality Assurance Studio"
    | "Mobile Studio"
    | "Operations Department"
    | "Project Management Team"
    | "People Department"
    | "Administration and Finance Department";
  type Position = string;
  type Candidate = string;
  type StageName =
    | "Hired"
    | "HR Interview"
    | "Technical Interview"
    | "Applied"
    | "English Interview";
  type DateString = string;
  type JIRAKey = string;
  type BusinessUnit =
    | "ALL"
    | "BU 1"
    | "BU 2"
    | "BU 3"
    | "BU 4"
    | "BU 5"
    | "BU 6"
    | "BU 7"
    | "BU 8"
    | "BU 9"
    | "BU 10";
  type Match = {
    studio: Studio;
    position: Position;
    candidate: Candidate;
    stage_name: StageName;
    created_at: DateString;
    updated_at: DateString;
    jira_key: JIRAKey | null;
    business_unit: BusinessUnit | null;
  };
  type MatchWithBU = Match & { business_unit: BusinessUnit };
  type Branded<T, B> = T & { __brand: B };
  type ValidStudio = Branded<Studio, "ValidStudio">;
  type ValidPosition = Branded<Position, "ValidPosition">;
  type ValidCandidate = Branded<Candidate, "ValidCandidate">;
  type ValidStageName = Branded<StageName, "ValidStageName">;
  type ValidDateString = Branded<DateString, "ValidDateString">;
  type ValidMatch = Branded<Match, "ValidMatch">;
}
