import { Box } from "grommet";
import { useContext, useEffect, useState } from "react";
import { AppContext, InstanceContext } from "../ContextProviders";
import { WizardContext } from "./Wizard";
import { Output } from "../Output";

export function InstanceInstall() {
  const [privatekey, setPrivateKey] = useState();

  const { valid, setValid } = useContext(WizardContext);
  const { instance } = useContext(InstanceContext);
  const { output } = useContext(AppContext);

  useEffect(() => {
    const queryAsync = async () => {
      setPrivateKey(await window.ezdemoAPI.getPrivateKey());
    };
    queryAsync();
  }, []);

  useEffect(() => {
    const startInstall = async () => {
      if (instance && privatekey) {
        let vars = {
          ip: instance.PublicIpAddress,
          // TODO: username should be fixed for AWS/Azure/Vmware images
          username:
            instance.PlatformDetails === "Linux/UNIX" ? "ubuntu" : "ec2-user",
          privatekey: privatekey,
        };
        setValid(false);
        await window.ezdemoAPI.ansiblePlay(["install", vars]);
        setValid(true);
      }
    };
    startInstall();
  }, [instance, privatekey, setValid, valid]);

  return (
    <Box margin="medium" width="xxlarge" height="xlarge" overflow="auto">
      <Output output={output} />
    </Box>
  );
}

export default InstanceInstall;
