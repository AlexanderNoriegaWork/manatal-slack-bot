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
  type StageName = string;
  type DateString = string;
  type Match = {
    studio: Studio;
    position: Position;
    candidate: Candidate;
    stage_name: StageName;
    created_at: DateString;
    updated_at: DateString;
  };
  type Branded<T, B> = T & { __brand: B };
  type ValidStudio = Branded<Studio, "ValidStudio">;
  type ValidPosition = Branded<Position, "ValidPosition">;
  type ValidCandidate = Branded<Candidate, "ValidCandidate">;
  type ValidStageName = Branded<StageName, "ValidStageName">;
  type ValidDateString = Branded<DateString, "ValidDateString">;
  type ValidMatch = Branded<Match, "ValidMatch">;
}
