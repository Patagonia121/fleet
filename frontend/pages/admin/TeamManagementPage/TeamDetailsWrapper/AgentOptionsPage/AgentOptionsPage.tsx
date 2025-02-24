import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useErrorHandler } from "react-error-boundary";
import yaml from "js-yaml";
import { constructErrorString, agentOptionsToYaml } from "utilities/yaml";
import endpoints from "utilities/endpoints";
import { EMPTY_AGENT_OPTIONS } from "utilities/constants";

import { NotificationContext } from "context/notification";
import { IApiError } from "interfaces/errors";
import { ITeam } from "interfaces/team";

import teamsAPI, { ILoadTeamsResponse } from "services/entities/teams";
import osqueryOptionsAPI from "services/entities/osquery_options";

// @ts-ignore
import validateYaml from "components/forms/validators/validate_yaml";
import Button from "components/buttons/Button";
import Spinner from "components/Spinner";
import CustomLink from "components/CustomLink";
// @ts-ignore
import YamlAce from "components/YamlAce";

const baseClass = "agent-options";

interface IAgentOptionsPageProps {
  params: {
    team_id: string;
  };
}

const AgentOptionsPage = ({
  params: { team_id },
}: IAgentOptionsPageProps): JSX.Element => {
  const teamIdFromURL = parseInt(team_id, 10);
  const { renderFlash } = useContext(NotificationContext);

  const [teamName, setTeamName] = useState("");
  const [formData, setFormData] = useState<{ agentOptions?: string }>({});
  const [formErrors, setFormErrors] = useState<any>({});
  const [isUpdatingAgentOptions, setIsUpdatingAgentOptions] = useState(false);

  const { agentOptions } = formData;

  const handlePageError = useErrorHandler();

  const {
    isFetching: isFetchingTeamOptions,
    refetch: refetchTeamOptions,
  } = useQuery<ILoadTeamsResponse, Error, ITeam[]>(
    ["teams"],
    () => teamsAPI.loadAll(),
    {
      select: (data: ILoadTeamsResponse) => data.teams,
      onSuccess: (data) => {
        const selected = data.find((team) => team.id === teamIdFromURL);

        if (selected) {
          setFormData({
            agentOptions: agentOptionsToYaml(selected.agent_options),
          });
          setTeamName(selected.name);
        } else {
          handlePageError({ status: 404 });
        }
      },
      onError: (error) => handlePageError(error),
    }
  );

  const validateForm = () => {
    const errors: any = {};

    if (agentOptions) {
      const { error: yamlError, valid: yamlValid } = validateYaml(agentOptions);
      if (!yamlValid) {
        errors.agent_options = constructErrorString(yamlError);
      }
    }

    setFormErrors(errors);
  };

  // onChange basic yaml validation only
  useEffect(() => {
    validateForm();
  }, [formData]);

  const onFormSubmit = (evt: React.MouseEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const { TEAMS_AGENT_OPTIONS } = endpoints;

    setIsUpdatingAgentOptions(true);

    // Formatting of API not UI and allows empty agent options
    const formDataToSubmit = agentOptions
      ? yaml.load(agentOptions)
      : EMPTY_AGENT_OPTIONS;

    osqueryOptionsAPI
      .update(formDataToSubmit, TEAMS_AGENT_OPTIONS(teamIdFromURL))
      .then(() => {
        renderFlash(
          "success",
          `Successfully updated ${teamName} team agent options.`
        );
        refetchTeamOptions();
      })
      .catch((response: { data: IApiError }) => {
        console.error(response);

        const agentOptionsInvalid =
          response.data.errors[0].reason.includes("unsupported key provided") ||
          response.data.errors[0].reason.includes("invalid value type");

        return renderFlash(
          "error",
          <>
            Could not update {teamName} team agent options.{" "}
            {response.data.errors[0].reason}
            {agentOptionsInvalid && (
              <>
                <br />
                If you’re not using the latest osquery, use the fleetctl apply
                --force command to override validation.
              </>
            )}
          </>
        );
      })
      .finally(() => {
        setIsUpdatingAgentOptions(false);
      });
  };

  const handleAgentOptionsChange = (value: string) => {
    setFormData({ ...formData, agentOptions: value });
  };

  return (
    <div className={`${baseClass}`}>
      <p className={`${baseClass}__page-description`}>
        Agent options configure the osquery agent. When you update agent
        options, they will be applied the next time a host checks in to Fleet.
        <br />
        <CustomLink
          url="https://fleetdm.com/docs/using-fleet/fleet-ui#configuring-agent-options"
          text="Learn more about agent options"
          newTab
          multiline
        />
      </p>
      {isFetchingTeamOptions ? (
        <Spinner />
      ) : (
        <div className={`${baseClass}__form-wrapper`}>
          <form
            className={`${baseClass}__form`}
            onSubmit={onFormSubmit}
            autoComplete="off"
          >
            <div className={`${baseClass}__btn-wrap`}>
              <p>YAML</p>
              <Button
                type="submit"
                variant="brand"
                className="save-loading"
                isLoading={isUpdatingAgentOptions}
              >
                Save options
              </Button>
            </div>
            <YamlAce
              wrapperClassName={`${baseClass}__text-editor-wrapper`}
              onChange={handleAgentOptionsChange}
              name="agentOptions"
              value={agentOptions}
              parseTarget
              error={formErrors.agent_options}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default AgentOptionsPage;
