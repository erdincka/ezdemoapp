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

  const { output, setOutput, connection } = useContext(AppContext);

  // Check output for install state
  const installer_url = output?.find((l) => l.match(/https:\/\/\S*:9443/));
  const df_url = installer_url?.replace(":9443", ":8443");
  // const installerInstalled = output?.find((l) => l.includes(installer_url));
  const install_task = "install started - this will take a while";
  const install_started = output?.find((l) => l.includes(install_task));

  const task_finished = output?.some((l) => l.includes("PLAY RECAP"));
  // const task_success = output?.some(
  //   (l) => l.includes("unreachable=0") && l.includes("failed=0")
  // );

  const startInstall = async () => {
    setWait(true);
    setOutput([]); // clear the previous output
    await window.ezdemoAPI.ansiblePlay(["df-install", connection]);
  };

  useEffect(() => {
    if (task_finished) setWait(false);
  }, [task_finished]);

  return (
    <Box>
      <NavigationCard
        icon={<Install />}
        title="Install"
        description={
          <NameValueList pairProps={{ direction: "column" }}>
            <NameValuePair key="installer" name="Installer">
              <Anchor
                target="_blank"
                rel="noopener"
                label={installer_url || "--"}
                href={installer_url}
              />
            </NameValuePair>
            <NameValuePair key="mcs" name="MCS">
              <Anchor
                target="_blank"
                rel="noopener"
                href={df_url}
                label={install_started ? "Wait for install..." : df_url}
              />
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
