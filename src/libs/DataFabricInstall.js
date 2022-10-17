import {
  Anchor,
  Box,
  Button,
  NameValueList,
  NameValuePair,
  Spinner,
} from "grommet";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../ContextProviders";
import { Deploy, Install } from "grommet-icons";
import { NavigationCard } from "./Utils";

export function DataFabricInstall() {
  const [wait, setWait] = useState(false);

  const { output, setOutput, connection, setConnection } =
    useContext(AppContext);

  const installer_url = `https://${connection.address}:9443/`;

  // Check output for install state
  const install_started_task = "install started - this will take a while";
  const install_started = output?.find((l) => l.includes(install_started_task));

  const task_finished =
    output?.some((l) => l.includes("install data fabric")) &&
    output?.some((l) => l.includes("PLAY RECAP"));
  const task_success =
    task_finished &&
    output?.some((l) => l.includes("unreachable=0") && l.includes("failed=0"));

  const startInstall = async () => {
    setWait(true);
    setOutput([]); // clear the previous output
    await window.ezdemoAPI.ansiblePlay(["df-install", connection]);
  };

  useEffect(() => {
    if (task_finished) setWait(false);
  }, [task_finished]);

  useEffect(() => {
    if (task_success)
      setConnection((old) => {
        return { ...old, dfRunning: true };
      });
  }, [setConnection, task_success]);

  return (
    <Box direction="row" gap="medium">
      <NavigationCard
        icon={<Install />}
        title="Install"
        description={
          <NameValueList pairProps={{ direction: "column" }}>
            <NameValuePair key="installer" name="Installer">
              <Anchor
                target="_blank"
                rel="noopener"
                disabled={!install_started}
                href={install_started ? installer_url : null}
                label={install_started ? "Installer" : "waiting installer..."}
              />
            </NameValuePair>
            <NameValuePair key="status" name="Status">
              {task_finished
                ? task_success
                  ? "Successfully installed"
                  : "Install not finished, check status with the Installer UI"
                : "waiting for install..."}
            </NameValuePair>
          </NameValueList>
        }
        action={
          <Button
            primary
            label={wait ? "Wait for Install..." : "Start Installation"}
            icon={wait ? <Spinner /> : <Deploy />}
            onClick={startInstall}
            disabled={!connection?.canInstall || wait}
          />
        }
        height="medium"
        background={
          connection?.canInstall ? "background-front" : "background-back"
        }
      />
    </Box>
  );
}
