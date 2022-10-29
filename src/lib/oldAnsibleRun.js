import { useContext, useEffect } from "react";
import { AppContext } from "../ContextProviders";
import { getMatchBetweenRegex } from "./Utils";

export const AnsibleRun = ({
  playbook,
  playbookVars,
  playStartText,
  outputStartText,
  outputEndText,
  onComplete,
}) => {
  const { output } = useContext(AppContext);

  const task_started = output?.some((l) => l.includes(playStartText));

  const task_finished =
    task_started && output?.some((l) => l.includes("PLAY RECAP"));

  const task_success = output?.some(
    (l) => l.includes("unreachable=0") && l.includes("failed=0")
  );

  const task_fail_message =
    task_finished && !task_success
      ? {
          error: getMatchBetweenRegex(output.join(""), '"msg": "', '",'),
        }
      : null;

  const task_result = task_success
    ? JSON.parse(
        getMatchBetweenRegex(
          output.join(""),
          outputStartText,
          outputEndText
        ).replaceAll("'", '"')
      )
    : task_fail_message;

  useEffect(() => {
    if (task_finished) {
      onComplete(task_result);
    }
  }, [onComplete, task_finished, task_result]);

  useEffect(() => {
    if (playbook && playbookVars) {
      window.ezdemoAPI.ansiblePlay([playbook, playbookVars]);
    }
  }, [playbook, playbookVars]);

  return <></>;
};
