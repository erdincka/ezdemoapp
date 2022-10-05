import { Box, Button, Card, CardBody, Layer, Text } from "grommet";
import { Amazon, Vmware } from "grommet-icons";
import { useState, useMemo } from "react";
import { ClientContext } from "../ContextProviders";
import { AwsWizard } from "./AwsWizard";

export const DataFabricSetup = () => {
  const [showProvider, setShowProvider] = useState("");
  // const [provider, setProvider] = useState();
  const [client, setClient] = useState();
  // const [instance, setInstace] = useState();

  const clientContextValue = useMemo(
    () => ({
      client,
      setClient,
    }),
    [client]
  );
  const data = [
    {
      title: "Amazon Web Services",
      description: "Use AWS instances",
      icon: <Amazon color="plain" />,
      cta: () => setShowProvider("aws"),
    },
    {
      title: "Vmware vSphere",
      description: "Use vSphere/vCloud VMs",
      icon: <Vmware color="plain" />,
      cta: () => setShowProvider("vmware"),
    },
  ];

  return (
    <Box direction="row">
      {data.map(({ icon, title, description, cta }, index) => (
        <Card key={index} margin="small">
          <CardBody gap="small" align="start" flex="grow">
            {icon}
            <Text size="large" weight="bold" color="text-strong">
              {title}
            </Text>
            <Text color="text-weak">{description}</Text>
            <Button label="Select" secondary onClick={cta} />
          </CardBody>
        </Card>
      ))}

      {showProvider !== "" && (
        <Layer
          position="center"
          modal
          onClickOutside={() => setShowProvider("")}
          onEsc={() => setShowProvider("")}
        >
          <ClientContext.Provider value={clientContextValue}>
            <Box fill="vertical" overflow="auto" width="large">
              {showProvider === "aws" && (
                <AwsWizard closer={() => setShowProvider("")} />
              )}
            </Box>{" "}
          </ClientContext.Provider>
        </Layer>
      )}
    </Box>
  );
};

export default DataFabricSetup;
