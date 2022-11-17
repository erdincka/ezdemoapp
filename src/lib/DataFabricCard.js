import { Box, Button, Heading, Page, PageHeader, Text } from "grommet";
import { Ezmeral } from "grommet-icons";
import { useNavigate, useParams } from "react-router-dom";
import { DataFabricUseCases } from "./DataFabricUseCases";
import { ReverseAnchor } from "./ReverseAnchor";
import { BrowserLink, copyToClipboard } from "./Utils";

export const DataFabricCard = () => {
  const { address } = useParams();
  const navigate = useNavigate();

  const clusters = JSON.parse(localStorage.getItem("clusters"));
  const getClusterHost = (addr) => clusters.find((c) => c.address === addr);
  // const fqdn = getClusterHost(address).fqdn;

  const services = [
    { name: "Installer", url: `https://${address}:9443/` },
    { name: "MCS", url: `https://${address}:8443/` },
    {
      name: "S3 Object Store",
      url: `https://${address}:8443/app/mcs/opal/#/home`,
    },
    { name: "Airflow", url: `https://${address}:8780/` },
    { name: "NiFi (*)", url: `https://${address}:12443/nifi/` },
    { name: "Drill", url: `https://${address}:8047/` },
    { name: "Hue", url: `https://${address}:8888/` },
    { name: "Zeppelin", url: `https://${address}:9995/` },
    { name: "Ranger", url: `https://${address}:6182/` },
    // { name: "Livy Rest", url: `https://${address}:8998/` },
    { name: "Grafana", url: `https://${address}:3000/` },
    { name: "Kibana", url: `https://${address}:5601/` },
  ];

  const getClusterName = (address) =>
    getClusterHost(address).cluster_name || address;

  return (
    <Page pad={{ horizontal: "medium" }}>
      <PageHeader
        title={getClusterName(address)}
        parent={<ReverseAnchor label="Back" onClick={() => navigate(-1)} />}
        actions={
          <Button
            icon={<Ezmeral color="plain" />}
            onClick={() => copyToClipboard(address)}
          />
        }
        pad={{ vertical: "medium" }}
      />
      <Heading level={5}>Endpoints</Heading>
      <Box fill="horizontal" direction="row" gap="small" justify="between">
        {services.map((service) => (
          <BrowserLink
            key={service.name}
            label={service.name}
            url={service.url}
          />
        ))}
      </Box>
      <Text alignSelf="end" color="text-weak">
        (*) NiFi credentials: admin/nifiadminpass
      </Text>
      <Heading level={5}>Use Cases</Heading>
      <DataFabricUseCases host={getClusterHost(address)} />
    </Page>
  );
};
