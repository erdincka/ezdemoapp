import { Box, PageContent, Page } from "grommet";
import { useContext } from "react";
import { AppContext } from "./ContextProviders";
import { AwsInstanceSelect } from "./lib/AWS/AwsInstanceSelect";
import { ListServers } from "./lib/ListServers";
import { ListClusters } from "./lib/ListClusters";

export function DataFabric() {
  const { connection, client } = useContext(AppContext);

  return (
    <Page overflow="auto">
      <PageContent>
        {/* Clusters List */}
        <ListClusters />

        {/* Servers */}
        <ListServers />

        {/* AWS Resources */}
        {client?.aws && <AwsInstanceSelect client={client.aws} />}

        <Box gap="medium" margin="small">
          Connection: {JSON.stringify(connection)}
        </Box>
      </PageContent>
    </Page>
  );
}
