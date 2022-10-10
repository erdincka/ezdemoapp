import { Box, List, Text } from "grommet";
import { Redhat, Ubuntu } from "grommet-icons";
import { useContext, useEffect, useState } from "react";
import { ClientContext, InstanceContext } from "../ContextProviders";
import { AwsInstanceCreate } from "./AwsInstanceCreate";
import { getInstances } from "./ec2Client";
import { getInstanceName } from "./Utils";
import { WizardContext } from "./Wizard";

export function AwsInstanceSelect() {
  const [instances, setInstances] = useState();
  const { client } = useContext(ClientContext);
  const { instance, setInstance } = useContext(InstanceContext);
  const { setValid } = useContext(WizardContext);

  useEffect(() => {
    setValid(instance ? true : false);
  }, [instance, setValid]);

  useEffect(() => {
    const queryAsync = async () => {
      if (client) setInstances(await getInstances(client));
    };
    queryAsync();
  }, [client]);

  useEffect(() => {
    const queryAsync = async () => {
      if (instance) {
        setInstances(await getInstances(client));
        setValid(true);
      }
    };
    queryAsync();
  }, [client, instance, setValid]);

  return (
    <Box margin="small" fill>
      {instances && (
        <List
          data={instances}
          onClickItem={(e) => {
            setInstance(e.item);
          }}
        >
          {(item, index, { active }) => (
            <Box
              direction="row"
              gap="small"
              key={index}
              align="between"
              width="medium"
            >
              {item.PlatformDetails === "Linux/UNIX" ? (
                <Ubuntu size="medium" color="plain" />
              ) : (
                <Redhat size="medium" color="plain" />
              )}
              <Text weight="bold" color={!active ? "text-weak" : null}>
                {getInstanceName(item)}
              </Text>
              <Text color={!active ? "text-weak" : null}>
                {item.InstanceId}
              </Text>
              <Text color={!active ? "text-weak" : null}>
                {item.PublicIpAddress}
              </Text>
            </Box>
          )}
        </List>
      )}
      <Text weight="bold">Create new instance:</Text>
      <AwsInstanceCreate />
    </Box>
  );
}

export default AwsInstanceSelect;
