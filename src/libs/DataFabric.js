import {
  Paragraph,
  Heading,
  Box,
  NameValueList,
  NameValuePair,
  Text,
} from "grommet";
import { useContext, useMemo, useState } from "react";
import { AppContext, InstanceContext } from "../ContextProviders";
import { DataFabricSetup } from "./DataFabricSetup";

export function DataFabric() {
  const [instance, setInstance] = useState();

  const { learning } = useContext(AppContext);

  const contextValue = useMemo(
    () => ({
      instance,
      setInstance,
    }),
    [instance]
  );

  return (
    <Box fill overflow="auto">
      {learning && <Heading level="4">Introduction</Heading>}
      {learning && (
        <Paragraph fill>
          To start with, we need a working cluster to access. We can use a
          single-node test environment, or use a full production-grade
          multi-node cluster.
        </Paragraph>
      )}
      <Heading level="4">Data Fabric Cluster</Heading>
      {learning && (
        <Paragraph fill>
          We will start by creating our own playground. Choose your provider and
          we will either use an existing node or create a new one to continue
          with our learning journey.
        </Paragraph>
      )}

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
            <Text color="text-strong">120GB</Text>
          </NameValuePair>
          <NameValuePair name="Data Disk">
            <Text color="text-strong">10GB</Text>
          </NameValuePair>
        </NameValueList>
      )}
      {learning && (
        <Paragraph fill>
          We can connect to an existing cluster, or create a new one, using one
          of the following providers.
        </Paragraph>
      )}
      <InstanceContext.Provider value={contextValue}>
        <DataFabricSetup />
      </InstanceContext.Provider>
    </Box>
  );
}

export default DataFabric;
