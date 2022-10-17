import {
  Paragraph,
  Heading,
  Box,
  NameValueList,
  NameValuePair,
  Text,
  Button,
  Anchor,
  Grid,
} from "grommet";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "./ContextProviders";
import { DataFabricConnect } from "./libs/DataFabricConnect";
import { AwsWizard } from "./libs/AwsWizard";
import {
  Amazon,
  Cloud,
  Compare,
  Cubes,
  Hadoop,
  Iteration,
  Server,
  Time,
  Transaction,
  Vmware,
} from "grommet-icons";
import { NavigationCard } from "./libs/Utils";
import { ServerConnect } from "./libs/ServerConnect";
import { ServerVerify } from "./libs/ServerVerify";
import { DataFabricInstall } from "./libs/DataFabricInstall";

export function DataFabric() {
  const [haveCluster, setHaveCluster] = useState(false);
  const [haveServer, setHaveServer] = useState(false);
  const [cloud, setCloud] = useState(false);

  const { learning, connection } = useContext(AppContext);

  const dfOptions = [
    {
      icon: <Hadoop color="plain" />,
      title: "Yes",
      description: "I have a Data Fabric that I can use",
      action: "Connect",
      value: true,
    },
    {
      icon: <Server />,
      title: "No",
      description: "I need to install Data Fabric",
      action: "Create",
      value: false,
    },
  ];

  const serverOptions = [
    {
      icon: <Server />,
      title: "Yes",
      description: "I have a server to use",
      action: "Connect",
      value: true,
    },
    {
      icon: <Cloud />,
      title: "No",
      description: "Help me create one",
      action: "Create",
      value: false,
    },
  ];

  const cloudOptions = [
    {
      icon: <Amazon />,
      title: "Amazon Web Services",
      description: "AWS instances",
      action: "Select",
      value: "aws",
    },
    {
      icon: <Vmware />,
      title: "VMware",
      description: "vSphere Cloud VMs",
      action: "Coming soon...",
      value: "vmware",
    },
  ];

  useEffect(() => {
    if (connection.connected) {
      setCloud("");
    }
  }, [connection.connected]);

  // connection states:
  // connected: ansible ping successfull
  // canInstall: server verified for installation
  // dfRunning: df services running
  const stage = connection?.dfRunning
    ? "df"
    : connection.canInstall
    ? "install"
    : connection.connected
    ? "verify"
    : "connect";

  const services = [
    { name: "MCS", url: `https://${connection?.address}:8443/` },
    {
      name: "S3 Object Store",
      url: `https://${connection?.address}:8443/app/mcs/opal/#/home`,
    },
    { name: "Drill", url: `https://${connection?.address}:8047/` },
    { name: "Grafana", url: `https://${connection?.address}:3000/` },
    { name: "Hue", url: `https://${connection?.address}:8888/` },
    { name: "Kibana", url: `https://${connection?.address}:5601/` },
  ];

  const useCases = [
    {
      name: "Stream Processing",
      description:
        "See how real time events are processed with Data Fabric using Event Store",
      icon: <Compare />,
      action: "Select",
    },
    {
      name: "DB Query",
      description: "",
      icon: <Cubes />,
      action: "Select",
    },
    {
      name: "Realtime",
      description: "",
      icon: <Time />,
      action: "Select",
    },
    {
      name: "Transaction",
      description: "",
      icon: <Transaction />,
      action: "Select",
    },
    {
      name: "Workflows",
      description: "",
      icon: <Iteration />,
      action: "Select",
    },
  ];

  return (
    <Box fill overflow="auto">
      {learning && <Heading level="4">Introduction to Data Fabric</Heading>}
      {learning && <Paragraph>INTRO HERE</Paragraph>}
      <Paragraph fill>
        To start with, we need a working cluster to access. We can create a
        single-node test environment, or use a full production-grade multi-node
        cluster.
      </Paragraph>
      {learning && <Text>This is what we need:</Text>}
      {learning && (
        <NameValueList>
          <NameValuePair name="Operating System">
            <Text color="text-strong">Linux x86_64</Text>
          </NameValuePair>
          <NameValuePair name="CPU">
            <Text color="text-strong">16 cores</Text>
          </NameValuePair>
          <NameValuePair name="Memory">
            <Text color="text-strong">64GB</Text>
          </NameValuePair>
          <NameValuePair name="OS Disk">
            <Text color="text-strong">150GB</Text>
          </NameValuePair>
          <NameValuePair name="Data Disk">
            <Text color="text-strong">100GB</Text>
          </NameValuePair>
        </NameValueList>
      )}

      <Heading level={4}>Do you have an existing Data Fabric cluster?</Heading>
      <Box direction="row" gap="medium">
        {dfOptions.map((item, index) => (
          <NavigationCard
            key={index}
            background={
              item.value === haveCluster
                ? "background-front"
                : "background-back"
            }
            icon={item.icon}
            title={item.title}
            description={item.description}
            action={
              <Button
                label={item.action}
                primary={item.value === haveCluster}
                secondary={item.value !== haveCluster}
                onClick={() => setHaveCluster(item.value)}
              />
            }
          />
        ))}
      </Box>

      {haveCluster ? (
        <DataFabricConnect />
      ) : (
        <Box margin="small">
          <Heading level={4}>
            Do you have a server to install Data Fabric?
          </Heading>
          <Box direction="row" gap="medium">
            {serverOptions.map((item, index) => (
              <NavigationCard
                key={index}
                background={
                  item.value === haveServer
                    ? "background-front"
                    : "background-back"
                }
                icon={item.icon}
                title={item.title}
                description={item.description}
                action={
                  <Button
                    label={item.action}
                    primary={item.value === haveServer}
                    secondary={item.value !== haveServer}
                    onClick={() => setHaveServer(item.value)}
                  />
                }
              />
            ))}
          </Box>
          {haveServer ? (
            <ServerConnect />
          ) : (
            <Box margin="small">
              <Heading level={4}>Select your cloud provider</Heading>
              <Box direction="row" gap="medium">
                {cloudOptions.map((item, index) => (
                  <NavigationCard
                    key={index}
                    background={
                      item.value === cloud
                        ? "background-front"
                        : "background-back"
                    }
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    action={
                      <Button
                        label={item.action}
                        primary={item.value === cloud}
                        secondary={item.value !== cloud}
                        onClick={() => setCloud(item.value)}
                      />
                    }
                  />
                ))}
              </Box>
              {cloud === "aws" && <AwsWizard />}
            </Box>
          )}
        </Box>
      )}

      {/* We have a connection. Select options based on server state */}
      {stage === "connect" && (
        <Heading level={4}>Select a server to start with</Heading>
      )}

      {stage === "verify" && !haveCluster && (
        <Box fill="horizontal">
          <Heading level={4}>Connected to {connection.address}</Heading>
          <Box direction="row" gap="medium">
            <ServerVerify />
          </Box>
        </Box>
      )}

      {stage === "install" && (
        <Box fill="horizontal">
          <Heading level={4}>We are ready to install Data DataFabric</Heading>
          <NameValueList>
            <NameValuePair name="IP">{connection.address}</NameValuePair>
            <NameValuePair name="Cores">
              {connection.canInstall.total_cores}
            </NameValuePair>
            <NameValuePair name="Memory (MB)">
              {connection.canInstall.total_memory_mb}
            </NameValuePair>
            <NameValuePair name="Swap (MB)">
              {connection.canInstall.total_swap_mb}
            </NameValuePair>
            <NameValuePair name="Disks">
              {connection.canInstall.available_disks}
            </NameValuePair>
          </NameValueList>

          <DataFabricInstall />
        </Box>
      )}

      {stage === "df" && (
        <Box fill="horizontal">
          <Heading level={4}>Data Fabric Services</Heading>
          <NameValueList>
            {services.map((service) => (
              <NameValuePair name={service.name} key={service.name}>
                <Anchor
                  label={service.name}
                  href={service.url}
                  target="_blank"
                  rel="noopener"
                />
              </NameValuePair>
            ))}
          </NameValueList>
          <Heading level={4}>Select Demo Use Case</Heading>
          <Grid columns={["auto", "auto"]} gap="medium">
            {useCases.map((uc) => (
              <NavigationCard
                key={uc.name}
                title={uc.name}
                description={uc.description}
                icon={uc.icon}
                action={uc.action}
              />
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export default DataFabric;
