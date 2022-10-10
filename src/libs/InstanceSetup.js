import { Box, Button, Text } from "grommet";
import { useContext, useState } from "react";
import InstancePrecheck from "./InstancePrecheck";
import { badIcon, goodIcon } from "./Utils";
import InstanceInstall from "./InstanceInstall";
import { AppContext, InstanceContext } from "../ContextProviders";
import { LogViewer } from "../LogViewer";

export function InstanceSetup() {
  const [precheckOpen, setPrecheckOpen] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);
  const [precheckStatus, setPrecheckStatus] = useState(false);
  const [installStatus, setInstallStatus] = useState(false);

  const { output } = useContext(AppContext);

  // const { instance } = props;
  const { instance } = useContext(InstanceContext);

  // Output data capture
  const re = /TASK [ezdemo_out] \*(.*)PLAY RECAP \*/;
  const ansible_output = output?.map((l) => l.replace(/\n$/g, "").match(re));

  return (
    <Box margin="small">
      <Box direction="row">
        <Button
          label="Pre-check"
          onClick={() => setPrecheckOpen(!precheckOpen)}
          icon={precheckStatus ? goodIcon : badIcon}
          hoverIndicatorwidth="medium"
        />
        <Text weight="bold" alignSelf="center">
          {"-->"}
        </Text>
        <Button
          label="Install"
          onClick={() => setInstallOpen(!installOpen)}
          icon={installStatus ? goodIcon : badIcon}
          hoverIndicatorwidth="medium"
        />
      </Box>
      <InstancePrecheck
        instance={instance}
        setPrecheckStatus={setPrecheckStatus}
      />
      <InstanceInstall
        instance={instance}
        setPrecheckStatus={setInstallStatus}
      />
      {/* <pre>{JSON.stringify(instance, null, 2)}</pre> */}
      {JSON.stringify(ansible_output)}
      <LogViewer lines={output} />
    </Box>
  );
}

export default InstanceSetup;
