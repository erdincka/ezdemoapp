import {
  Anchor,
  Box,
  Button,
  List,
  Menu,
  NameValueList,
  NameValuePair,
  Spinner,
  Text,
} from "grommet";
import { Lock, More, Redhat, Server, Ubuntu } from "grommet-icons";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../ContextProviders";
import { AnsibleRun } from "../oldAnsibleRun";
import { Popup } from "../Popup";
import { ServerConnect } from "../ServerConnect";
import { badIcon, goodIcon, mapResources } from "../Utils";
import { AwsInstanceCreate } from "./AwsInstanceCreate";
import { getInstances, getInstanceName } from "./ec2Client";

export function AwsInstanceSelect({ client }) {
  const [instances, setInstances] = useState();
  // const [ansible, runAnsible] = useState(false);
  const [wait, setWait] = useState(false);
  const [open, setOpen] = useState(false);
  const { connection, setConnection } = useContext(AppContext);

  useEffect(() => {
    const queryAsync = async () => {
      if (client) setInstances(await getInstances(client));
    };
    queryAsync();
  }, [client]);

  const instance_icon = (i) =>
    i.PlatformDetails === "Linux/UNIX" ? (
      <Ubuntu size="medium" color="plain" />
    ) : (
      <Redhat size="medium" color="plain" />
    );

  const instance_user = (i) =>
    i.PlatformDetails === "Linux/UNIX" ? "ubuntu" : "ec2-user";

  const newConnection = (instance) => {
    return {
      address: instance.PublicIpAddress,
      username: instance_user(instance),
    };
  };

  const handleSelect = (instance) => {
    // get instance details and set the connection
    setConnection(newConnection(instance));
  };

  const checkResourcesFor = (addr) => {
    setWait({ canInstall: addr });
  };

  const updateResourcesFor = (item, data) => {
    setWait(false);
    setConnection({
      ...item,
      resources: mapResources(data),
    });
  };
  return (
    <>
      <Text weight="bold">Instances on {client.config.region}</Text>

      {instances && (
        <List
          data={instances}
          action={(item, index) => (
            <Box key={index} direction="row" align="between" gap="medium">
              <Box direction="row" gap="small" align="center">
                {wait?.resources === item.PublicIpAddress ? (
                  <Spinner />
                ) : connection.resources?.every((s) => s.valid) ? (
                  goodIcon
                ) : (
                  badIcon
                )}
                <Anchor
                  color="text-weak"
                  onClick={() => {
                    setConnection(newConnection(item));
                    setOpen("serverview");
                  }}
                >
                  {item.PublicIpAddress === connection.address &&
                  connection.connected
                    ? connection.resources
                      ? "Checked"
                      : "Not checked"
                    : "Not connected"}
                </Anchor>
                {wait?.canInstall === item.PublicIpAddress && (
                  <AnsibleRun
                    playbook="df-caninstall"
                    playbookVars={newConnection(item)}
                    playStartText="PLAY [Data Fabric pre-install verification]"
                    outputStartText="RESOURCES=="
                    outputEndText="==END_RESOURCES"
                    onComplete={(res) => {
                      setWait(false);
                      updateResourcesFor(item, res);
                    }}
                  />
                )}
              </Box>
              <Menu
                icon={<More />}
                hoverIndicator
                items={[
                  [
                    {
                      label: "Connect",
                      onClick: () => {
                        setConnection(newConnection(item));
                        setOpen("serverconnect");
                      },
                    },
                    {
                      label: "Check resources",
                      onClick: () => checkResourcesFor(item.PublicIpAddress),
                      disabled: !connection.connected,
                    },
                  ],
                ]}
              />
            </Box>
          )}
        >
          {(datum, index) => (
            <Box key={index} direction="row" gap="small">
              <Box alignSelf="center">{instance_icon(datum)}</Box>
              <Box align="center" gap="medium">
                <Anchor onClick={() => handleSelect(datum)}>
                  {getInstanceName(datum)}
                </Anchor>
              </Box>
            </Box>
          )}
        </List>
      )}
      <Button
        margin={{ vertical: "medium" }}
        secondary
        label="New Instance"
        alignSelf="start"
        onClick={() => setOpen("newinstance")}
      />
      {open === "newinstance" && (
        <Popup
          title="Create"
          subtitle="New EC2 Instance"
          icon={<Server />}
          closer={setOpen}
          content={
            <AwsInstanceCreate
              client={client}
              onSuccess={(res) =>
                setInstances((prev) => {
                  return [...prev, res];
                })
              }
            />
          }
        />
      )}

      {open === "serverconnect" && (
        <Popup
          title="Connect to"
          subtitle={"Instance: " + connection.address}
          icon={<Lock />}
          closer={setOpen}
          content={
            <ServerConnect
              host={connection.address}
              user={connection.username}
              onConnect={(c) => {
                if (c) {
                  setOpen(false);
                  setConnection((prev) => {
                    return { ...prev, connected: true };
                  });
                }
              }}
            />
          }
        />
      )}

      {open === "serverview" && (
        <Popup
          title="Server"
          subtitle="Status"
          closer={setOpen}
          icon={<Server />}
          content={
            <Box>
              <NameValueList
                pairProps={{ direction: "column" }}
                valueProps={{ width: ["auto", "medium"] }}
              >
                <NameValuePair name="Host">{connection.address}</NameValuePair>
                {connection?.resources?.map((res) => {
                  return (
                    <NameValuePair name={res.name} key={res.name}>
                      <Box align="center" gap="xsmall" direction="row">
                        {res.valid ? goodIcon : badIcon}
                        {res.state || "--"}
                      </Box>
                    </NameValuePair>
                  );
                })}
              </NameValueList>
            </Box>
          }
        />
      )}
    </>
  );
}

export default AwsInstanceSelect;
