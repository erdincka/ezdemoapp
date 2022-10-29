import { Box, Card, CardHeader, Grid, Heading, Text } from "grommet";
import { Hadoop, TestDesktop } from "grommet-icons";
import { useNavigate } from "react-router-dom";

const data = [
  {
    icon: <Hadoop />,
    title: "Data Fabric",
    subtitle: "Play with Ezmeral Data Fabric.",
    link: "datafabric",
  },
  {
    icon: <TestDesktop />,
    title: "MLOps",
    subtitle: "Advanced AI & Analytics.",
    link: "mlops",
  },
];
export const Home = () => {
  const navigate = useNavigate();

  return (
    <Box margin="small">
      <Grid columns={{ count: "fit", size: "medium" }} gap="medium">
        {data.map((datum, index) => (
          <Card key={index} onClick={() => navigate(datum.link)}>
            <CardHeader align="start" direction="column" gap="xsmall">
              {datum.icon}
              <Heading level={2} size="small" margin="none">
                {datum.title}
              </Heading>
              <Text size="small">{datum.subtitle}</Text>
            </CardHeader>
          </Card>
        ))}
      </Grid>
    </Box>
  );
};
