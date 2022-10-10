import { Anchor, Box, Button, Notification } from "grommet";
import { useContext, useEffect, useState } from "react";
import { AppContext, InstanceContext } from "../ContextProviders";
import { WizardContext } from "./Wizard";
import { LogViewer } from "../LogViewer";

export function InstanceInstall() {
  const [privatekey, setPrivateKey] = useState();
  const [wait, setWait] = useState(false);

  const { setValid } = useContext(WizardContext);
  const { instance } = useContext(InstanceContext);
  const { output } = useContext(AppContext);

  useEffect(() => {
    const queryAsync = async () => {
      setPrivateKey(await window.ezdemoAPI.getPrivateKey());
    };
    queryAsync();
    setValid(false); // initially we are not validated
  }, [setValid]);

  // Check output for install state
  const installer_url = "https://" + instance.PublicIpAddress + ":9443";
  const installerInstalled = output?.find((l) => l.contains(installer_url));
  const install_task = "wait for instal - this will take a while";
  const install_started = output?.find((l) => l.contains(install_task));
  const dfInstalled = output?.find((l) => l.match(/installer_run/));

  const startInstall = async () => {
    setWait(true);
    let vars = {
      ip: instance.PublicIpAddress,
      // TODO: username should be fixed for AWS/Azure/Vmware images
      username:
        instance.PlatformDetails === "Linux/UNIX" ? "ubuntu" : "ec2-user",
      privatekey: privatekey,
    };
    await window.ezdemoAPI.ansiblePlay(["install", vars]);
  };

  return (
    <Box margin="medium" width="xxlarge" height="xlarge" overflow="auto">
      <Button
        primary
        label={wait ? "Wait for Install..." : "Start Installation"}
        onClick={startInstall}
        disabled={wait}
      />
      <LogViewer lines={output} />
      {installerInstalled && (
        <Anchor target="_blank" href={installer_url} label="Installer UI" />
      )}
      {install_started && (
        <Notification message="Installation started, follow progress on Installer UI (username: mapr password: mapr)" />
      )}
      Install: {JSON.stringify(dfInstalled)}
    </Box>
  );
}

export default InstanceInstall;
