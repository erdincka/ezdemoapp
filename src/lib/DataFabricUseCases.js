import { Box, Grid } from "grommet";
import { Compare, Cubes, Iteration, Time, Transaction } from "grommet-icons";
import { NavigationCard } from "./NavigationCard";

export const DataFabricUseCases = () => {
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
    <Box>
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
  );
};
