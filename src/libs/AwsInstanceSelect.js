import { Box, Heading, List, Text } from "grommet";
import { Redhat, Ubuntu } from "grommet-icons";
import { useContext, useEffect, useState } from "react";
import { AppContext, AwsContext } from "../ContextProviders";
import { getInstances, getInstanceName } from "./ec2Client";
import { WizardContext } from "./Wizard";
import { AwsInstanceCreate } from "./AwsInstanceCreate";

export function AwsInstanceSelect() {
  const [instances, setInstances] = useState();
  const { setValid } = useContext(WizardContext);
  const { size, setConnection } = useContext(AppContext);
  const { client } = useContext(AwsContext);

  useEffect(() => {
    const queryAsync = async () => {
      if (client) setInstances(await getInstances(client));
    };
    queryAsync();
    setValid(false); // clean previous state
  }, [client, setValid]);

  const handleSelect = (instance) => {
    // get instance details and set the connection
    const newConnection = {
      address: instance.PublicIpAddress,
      username:
        instance.PlatformDetails === "Linux/UNIX" ? "ubuntu" : "ec2-user",
      privatekey: null,
      instance,
    };
    setConnection(newConnection);
    setValid(true);
  };

  const instance_icon = (i) =>
    i.PlatformDetails === "Linux/UNIX" ? (
      <Ubuntu size="medium" color="plain" />
    ) : (
      <Redhat size="medium" color="plain" />
    );

  return (
    <Box gap="small">
      <Heading level={5}>Existing</Heading>
      {instances && (
        <List
          data={instances}
          pad="small"
          action={(item, index) => (
            <Box key={index} direction="row" align="center" gap="medium">
              {!["xsmall", "small"].includes(size) && (
                <Text
                  weight="bold"
                  size="xsmall"
                  color={!item.verified ? "text-weak" : null}
                ></Text>
              )}
            </Box>
          )}
          onClickItem={(e) => handleSelect(e.item)}
          margin={
            ["xsmall", "small"].includes(size) ? { bottom: "large" } : undefined
          }
        >
          {(instance, index) => (
            <Box
              key={index}
              gap="medium"
              direction="row"
              align="center"
              justify="between"
            >
              <Box alignSelf="center">{instance_icon(instance)}</Box>
              <Box align="center" gap="medium">
                <Box>
                  <Text
                    weight="bold"
                    color={!instance.verified ? "text-weak" : null}
                  >
                    {getInstanceName(instance)}
                  </Text>
                  <Text color={!instance.verified ? "text-weak" : null}>
                    {instance.PublicIpAddress}
                  </Text>
                </Box>
              </Box>
            </Box>
          )}
        </List>
      )}
      <Heading level={5}>New</Heading>
      <AwsInstanceCreate />
    </Box>
  );
}

export default AwsInstanceSelect;
