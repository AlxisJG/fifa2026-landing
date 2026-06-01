export type SportmonksListResponse<T> = {
  data: T[];
  pagination?: {
    count?: number;
    per_page?: number;
    current_page?: number;
    has_more?: boolean;
  };
};

export type SportmonksState = {
  id?: number;
  state?: string;
  name?: string;
  short_name?: string;
  developer_name?: string;
};

export type SportmonksScore = {
  id?: number;
  fixture_id?: number;
  participant_id?: number;
  score?: {
    goals?: number;
    participant?: string;
  };
  description?: string;
};

export type SportmonksParticipant = {
  id: number;
  sport_id?: number;
  country_id?: number;
  venue_id?: number;
  gender?: string;
  name?: string;
  short_code?: string;
  image_path?: string;
  founded?: number;
  type?: string;
  placeholder?: boolean;
  last_played_at?: string;
  meta?: {
    location?: "home" | "away";
    position?: number;
    winner?: boolean;
  };
};

export type SportmonksVenue = {
  id?: number;
  country_id?: number;
  city_id?: number;
  name?: string;
  address?: string;
  zipcode?: string;
  city?: string;
  capacity?: number;
  image_path?: string;
};

export type SportmonksRound = {
  id?: number;
  sport_id?: number;
  league_id?: number;
  season_id?: number;
  stage_id?: number;
  name?: string;
  finished?: boolean;
  is_current?: boolean;
  starting_at?: string;
  ending_at?: string;
};

export type SportmonksStage = {
  id?: number;
  sport_id?: number;
  league_id?: number;
  season_id?: number;
  type_id?: number;
  name?: string;
  sort_order?: number;
  finished?: boolean;
  is_current?: boolean;
  starting_at?: string;
  ending_at?: string;
};

export type SportmonksGroup = {
  id?: number;
  sport_id?: number;
  league_id?: number;
  season_id?: number;
  stage_id?: number;
  name?: string;
  starting_at?: string;
  ending_at?: string;
};

export type SportmonksFixture = {
  id: number;
  sport_id?: number;
  league_id?: number;
  season_id?: number;
  stage_id?: number;
  group_id?: number;
  aggregate_id?: number;
  round_id?: number;
  state_id?: number;
  venue_id?: number;
  name?: string;
  starting_at?: string;
  result_info?: string;
  leg?: string;
  details?: string;
  length?: number;
  placeholder?: boolean;
  has_odds?: boolean;
  state?: SportmonksState;
  participants?: SportmonksParticipant[];
  scores?: SportmonksScore[];
  venue?: SportmonksVenue;
  round?: SportmonksRound;
  stage?: SportmonksStage;
  group?: SportmonksGroup;
};

export type SportmonksStandingDetail = {
  id?: number;
  type_id?: number;
  value?: number;
  type?: {
    id?: number;
    name?: string;
    code?: string;
    developer_name?: string;
  };
};

export type SportmonksStanding = {
  id: number;
  participant_id: number;
  sport_id?: number;
  league_id?: number;
  season_id?: number;
  stage_id?: number;
  group_id?: number;
  round_id?: number;
  standing_rule_id?: number;
  position?: number;
  result?: string;
  points?: number;
  participant?: SportmonksParticipant;
  details?: SportmonksStandingDetail[];
  group?: SportmonksGroup;
};

/** Round node inside GET /schedules/seasons/{id} → data[].rounds[] */
export type SportmonksScheduleRound = {
  id?: number;
  sport_id?: number;
  league_id?: number;
  season_id?: number;
  stage_id?: number;
  name?: string;
  finished?: boolean;
  is_current?: boolean;
  starting_at?: string;
  ending_at?: string;
  fixtures?: SportmonksFixture[];
};

/**
 * Top-level item in GET /schedules/seasons/{id} response (`data[]`).
 * Each entry is a competition stage (Group Stage, Round of 16, …) with nested rounds.
 */
export type SportmonksScheduleStage = {
  id?: number;
  sport_id?: number;
  league_id?: number;
  season_id?: number;
  type_id?: number;
  name?: string;
  sort_order?: number;
  finished?: boolean;
  is_current?: boolean;
  starting_at?: string;
  ending_at?: string;
  rounds?: SportmonksScheduleRound[];
  /** Some seasons expose fixtures directly on the stage. */
  fixtures?: SportmonksFixture[];
};

/** @deprecated Schedule season endpoint returns stages in `data`, not this wrapper shape. */
export type SportmonksSchedule = SportmonksScheduleStage;

export type SportmonksPlayer = {
  id: number;
  name?: string;
  display_name?: string;
  position_id?: number;
  image_path?: string;
};

export type SportmonksPosition = {
  id?: number;
  name?: string;
  code?: string;
  developer_name?: string;
};

export type SportmonksSquadEntry = {
  id: number;
  player_id?: number;
  team_id?: number;
  position_id?: number;
  jersey_number?: number;
  captain?: boolean;
  player?: SportmonksPlayer;
  position?: SportmonksPosition;
};

export type SportmonksTeam = {
  id: number;
  name?: string;
  short_code?: string;
  image_path?: string;
  placeholder?: boolean;
  players?: SportmonksPlayer[];
};

export type SportmonksTopscorerType = {
  id?: number;
  name?: string;
  code?: string;
  developer_name?: string;
};

export type SportmonksTopscorer = {
  id: number;
  season_id?: number;
  player_id?: number;
  participant_id?: number;
  type_id?: number;
  position?: number;
  total?: number;
  player?: SportmonksPlayer;
  participant?: SportmonksParticipant;
  type?: SportmonksTopscorerType;
};
