import {
  Paragraph,
  Heading,
  Tabs,
  Tab,
  Box,
  NameValueList,
  NameValuePair,
  Text,
} from "grommet";
import ProviderAws from "./ProviderAws";
import ProviderVmware from "./ProviderVmware";

function DataFabric(props) {
  const {
    isLearning,
    client,
    setClient,
    instance,
    setInstance,
    credentials,
    setCredentials,
  } = props;

  return (
    <Box fill overflow="auto">
      {isLearning && <Heading level="4">Introduction</Heading>}
      {isLearning && (
        <Paragraph fill>
          To start with, we need a working cluster to access. We can use a
          single-node test environment, or use a full production-grade
          multi-node cluster.
          <br />
          A Linux instance (Ubuntu 20.04 or RHEL 8.4) with minimum 16 cores,
          32GB Memory (64GB+ recommended for single-node) and 2+ disks (OS +
          Data disks).
          <br />
          Besides the operating system disk, you need to have a non-partitioned,
          non-formatted disk as data disk for the Data Fabric node. You can add
          more data disks for better performance and availability. But no RAID
          or any other protection mechanism should be used, as these will be
          handled by the Data Fabric platform itself.
        </Paragraph>
      )}
      <Heading level="4">Data Fabric Cluster</Heading>
      <Text>This is what we need:</Text>
      <NameValueList>
        <NameValuePair name="Operating System">
          <Text color="text-strong">Linux x86_64</Text>
        </NameValuePair>
        <NameValuePair name="CPU">
          <Text color="text-strong">16 cores</Text>
        </NameValuePair>
        <NameValuePair name="Memory">
          <Text color="text-strong">32GB</Text>
        </NameValuePair>
        <NameValuePair name="OS Disk">
          <Text color="text-strong">120GB</Text>
        </NameValuePair>
        <NameValuePair name="Data Disk">
          <Text color="text-strong">10GB</Text>
        </NameValuePair>
      </NameValueList>
      <Paragraph fill>
        We can connect to an existing cluster, or create a new one, using one of
        the following providers.
      </Paragraph>
      <Tabs justify="start" margin="small" defaultValue={null}>
        <Tab title="Aws">
          <ProviderAws
            client={client}
            setClient={setClient}
            instance={instance}
            setInstance={setInstance}
            credentials={credentials}
            setCredentials={setCredentials}
          />
        </Tab>
        <Tab title="Vmware">
          <ProviderVmware
            client={client}
            setClient={setClient}
            instance={instance}
            setInstance={setInstance}
            credentials={credentials}
            setCredentials={setCredentials}
          />
        </Tab>
      </Tabs>
    </Box>
  );
}

export default DataFabric;
