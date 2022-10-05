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
      } else setValid(false);
    };
    queryAsync();
  }, [client, instance, setValid]);

  // // if eligible instances found, select the first
  // useEffect(() => {
  //   if (instances?.length > 0) setInstance(instances[0]);
  // }, [instances, setInstance]);

  // // if instance is selected, close the new form
  // useEffect(() => {
  //   if (instance) setNewOpen(false);
  // }, [instance]);

  return (
    <Box margin="small" fill>
      {/* {instances && (
        <DataTable
          data={instances}
          columns={[
            {
              property: "PlatformDetails",
              header: "OS",
              render: (i) =>
                i.PlatformDetails === "Linux/UNIX" ? (
                  <Ubuntu size="medium" color="plain" />
                ) : (
                  <Redhat size="medium" color="plain" />
                ),
              pin: ["xsmall", "small"].includes(size),
            },
            {
              property: "name",
              header: "Name",
              primary: true,
              render: (i) => getInstanceName(i),
              pin: ["xsmall", "small"].includes(size),
            },
            {
              property: "PublicIpAddress",
              header: "IP Address",
              pin: ["xsmall", "small"].includes(size),
            },
            {
              property: "CpuOptions.CoreCount",
              header: "Cores",
              pin: ["xsmall", "small"].includes(size),
            },
          ]}
          fill
          onClickRow={({ datum }) => console.dir(datum)}
        />
      )} */}
      {instances && (
        <List
          alignSelf="stretch"
          // background="background-front"
          data={instances}
          onClickItem={(e) => {
            setInstance(e.item);
          }}
        >
          {(item, index, { active }) => (
            <Box direction="row" gap="small" key={index} align="between">
              <Box width="xxsmall" height="xxsmall">
                {item.PlatformDetails === "Linux/UNIX" ? (
                  <Ubuntu size="medium" color="plain" />
                ) : (
                  <Redhat size="medium" color="plain" />
                )}
              </Box>
              <Box align="left">
                <Text weight="bold" color={!active ? "text-weak" : null}>
                  {getInstanceName(item)} ({item.InstanceId})
                </Text>
                <Text color={!active ? "text-weak" : null}>
                  {item.PublicIpAddress}
                </Text>
              </Box>
            </Box>
          )}
        </List>
      )}
      <Text weight="bold">Create new instance:</Text>
      <AwsInstanceCreate client={client} setInstance={setInstance} />
    </Box>
  );
}

export default AwsInstanceSelect;
