import { PageContent, Page } from "grommet";
import { ListServers } from "./lib/ListServers";
import { ListClusters } from "./lib/ListClusters";

export function DataFabric() {
  return (
    <Page overflow="auto">
      <PageContent>
        {/* Clusters List */}
        <ListClusters />

        {/* Servers */}
        <ListServers />
      </PageContent>
    </Page>
  );
}
