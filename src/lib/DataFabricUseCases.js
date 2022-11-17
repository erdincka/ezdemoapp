import { Box, Button, Grid } from "grommet";
import {
  Deploy,
  Github,
  HostMaintenance,
  Iteration,
  Notification,
  Satellite,
  Time,
  Transaction,
} from "grommet-icons";
import { useNavigate } from "react-router-dom";
import { NavigationCard } from "./NavigationCard";
import { BrowserLink } from "./Utils";

export const DataFabricUseCases = ({ host }) => {
  const navigate = useNavigate();

  const select = (target) => navigate(`/datafabric/${host.address}/${target}`);

  const useCases = [
    {
      name: "Stock Market",
      description:
        "This demo application focuses on interactive market analysis with a graphical user interface in Apache Zeppelin",
      icon: <Time />,
      sourceUrl: "https://github.com/mapr-demos/finserv-application-blueprint",
      disabled: true,
    },
    {
      name: "Predictive Maintenance",
      description:
        "This project is intended to show how to build Predictive Maintenance applications on HPE Data Fabric.",
      icon: <HostMaintenance />,
      sourceUrl: "https://github.com/mapr-demos/predictive-maintenance",
      disabled: true,
    },
    {
      name: "Kafka Samples",
      description: "",
      icon: <Transaction />,
      sourceUrl: "https://github.com/mapr-demos/mapr-streams-sample-programs",
      disabled: true,
    },
    {
      name: "Satellite Images",
      description: "",
      icon: <Satellite />,
      sourceUrl: "https://github.com/erdincka/ezdemoapp",
      disabled: false,
    },
    {
      name: "NiFi",
      description: "",
      icon: <Notification />,
      sourceUrl: "",
      disabled: true,
    },
    {
      name: "Workflows",
      description: "",
      icon: <Iteration />,
      sourceUrl: "",
      disabled: true,
    },
  ];

  return (
    <Box>
      <Grid columns={["auto", "auto"]} gap="medium">
        {useCases.map((uc) => (
          <NavigationCard
            key={uc.name}
            title={uc.name}
            description={uc.description}
            icon={uc.icon}
            action={
              <Box direction="row" gap="small">
                <Button
                  secondary
                  disabled={uc.disabled}
                  icon={<Deploy />}
                  onClick={() => select(uc.name)}
                />
                <BrowserLink icon={<Github />} url={uc.sourceUrl} />
              </Box>
            }
          />
        ))}
      </Grid>
    </Box>
  );
};
