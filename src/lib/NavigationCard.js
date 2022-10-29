import { Box, Card, CardBody, CardFooter, Text } from "grommet";

export const NavigationCard = ({
  icon,
  title,
  description,
  action,
  background,
  height,
}) => (
  <Card
    // width="medium"
    fill="horizontal"
    height={height || "small"}
    pad={{ horizontal: "medium" }}
    background={background}
  >
    <Box pad={{ vertical: "small" }}>{icon}</Box>
    <CardBody pad="none">
      <Text color="text-strong" size="xlarge" weight="bold">
        {title}
      </Text>
      <Text>{description}</Text>
    </CardBody>
    <CardFooter
      align="start"
      gap="none"
      pad={{ vertical: "small", horizontal: "none" }}
    >
      {action}
    </CardFooter>
  </Card>
);
