import PropTypes from "prop-types";
import { IConfigFeatures, IWebhookSettings } from "./config";
import enrollSecretInterface, { IEnrollSecret } from "./enroll_secret";
import { IIntegrations } from "./integration";

export default PropTypes.shape({
  id: PropTypes.number.isRequired,
  created_at: PropTypes.string,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  agent_options: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  role: PropTypes.string, // role value is included when the team is in the context of a user
  user_count: PropTypes.number,
  host_count: PropTypes.number,
  secrets: PropTypes.arrayOf(enrollSecretInterface),
});

/**
 * The id, name, description, and host count for a team entity
 */
export interface ITeamSummary {
  id: number;
  name: string;
  description?: string;
  host_count?: number;
}

/**
 * The shape of a team entity excluding integrations and webhook settings
 */
export interface ITeam extends ITeamSummary {
  uuid?: string;
  display_text?: string;
  count?: number;
  created_at?: string;
  features?: IConfigFeatures;
  agent_options?: {
    [key: string]: any;
  };
  user_count?: number;
  host_count?: number;
  secrets?: IEnrollSecret[];
  role?: string; // role value is included when the team is in the context of a user
  mdm?: {
    macos_updates: {
      minimum_version: string;
      deadline: string;
    };
  };
}

/**
 * The webhook settings of a team
 */
export type ITeamWebhookSettings = Pick<
  IWebhookSettings,
  "vulnerabilities_webhook" | "failing_policies_webhook"
>;

/**
 * The integrations and webhook settings of a team
 */
export interface ITeamAutomationsConfig {
  webhook_settings: ITeamWebhookSettings;
  integrations: IIntegrations;
}

/**
 * The shape of a team entity including integrations and webhook settings
 */
export type ITeamConfig = ITeam & ITeamAutomationsConfig;

/**
 * The shape of a new member to add to a team
 */
interface INewMember {
  id: number;
  role: string;
}

/**
 * The shape of the body expected from the API when adding new members to teams
 */
export interface INewMembersBody {
  users: INewMember[];
}
export interface IRemoveMembersBody {
  users: { id?: number }[];
}
interface INewTeamSecret {
  team_id: number;
  secret: string;
  created_at?: string;
}
export interface INewTeamSecretBody {
  secrets: INewTeamSecret[];
}
export interface IRemoveTeamSecretBody {
  secrets: { secret: string }[];
}

export const teamIdParamFromUrlSearch = (s: string) => {
  return s.match(/(?:team_id=\d+)/i)?.[0]?.split("=")?.[1] || "";
};

export const parseTeamIdParam = (s: string) => {
  const parsed = parseInt(s, 10);

  return isNaN(parsed) ? -1 : parsed;
};

export const teamIdFromLocation = (location: { search: string }) => {
  return parseTeamIdParam(teamIdParamFromUrlSearch(location.search));
};

export const teamFromAvailableTeams = (
  teamId: number,
  availableTeams: ITeamSummary[]
) => {
  return availableTeams?.find((t) => t.id === teamId) || availableTeams?.[0];
};

export const ALL_TEAMS_ID = -1;
export const ALL_TEAMS_SUMMARY: ITeamSummary = {
  id: ALL_TEAMS_ID,
  name: "All teams",
} as const;

export const NO_TEAM_ID = 0;
export const NO_TEAM_SUMMARY: ITeamSummary = {
  id: NO_TEAM_ID,
  name: "No team",
} as const;

export const getDefaultTeamId = (
  availableTeams: ITeamSummary[],
  includeAll: boolean,
  includeNoTeam: boolean
) => {
  let defaultId = availableTeams[0].id;
  if (includeAll) {
    defaultId = availableTeams.find((t) => t.id === ALL_TEAMS_ID)
      ? ALL_TEAMS_ID
      : defaultId;
  } else if (includeNoTeam) {
    defaultId = availableTeams.find((t) => t.id === NO_TEAM_ID)
      ? NO_TEAM_ID
      : defaultId;
  } else {
    const defaultTeam = availableTeams.find((t) => t.id > NO_TEAM_ID);
    defaultId = defaultTeam ? defaultTeam.id : defaultId;
  }
  return defaultId;
};
