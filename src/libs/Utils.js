import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Layer,
  Notification,
  Text,
} from "grommet";
import {
  FormClose,
  FormLock,
  StatusCriticalSmall,
  StatusGoodSmall,
} from "grommet-icons";

import { useContext } from "react";
import { AppContext } from "../ContextProviders";

export const Identifier = ({ title, subtitle, icon }) => {
  return (
    <Box
      direction="row"
      gap="small"
      align="center"
      pad={{ horizontal: "small", vertical: "medium" }}
    >
      <Box pad={{ vertical: "xsmall" }}>{icon}</Box>
      <Box>
        <Text color="text-strong" size="large" weight="bold">
          {title}
        </Text>
        <Text>{subtitle}</Text>
      </Box>
    </Box>
  );
};

export const goodIcon = <StatusGoodSmall color="status-ok" size="small" />;
export const badIcon = (
  <StatusCriticalSmall color="status-critical" size="small" />
);

export const Popup = ({ title, subtitle, content, closer }) => {
  const { size } = useContext(AppContext);

  return (
    <Layer
      position="right"
      animate
      full={!["xxsmall"].includes(size) ? "vertical" : true}
      // modal
      onClickOutside={() => closer(false)}
      onEsc={() => closer(false)}
    >
      <Box
        fill="vertical"
        overflow="auto"
        width={!["xsmall", "small"].includes(size) ? "medium" : undefined}
        pad="medium"
      >
        <Box justify="between" direction="row">
          <Box flex={false} gap="small" direction="row">
            <Box justify="center">
              <FormLock />
            </Box>
            <Heading margin="none" size="small" level={2}>
              {title}
            </Heading>
          </Box>
          <Box justify="center">
            <Button icon={<FormClose />} onClick={() => closer(false)} />
          </Box>
        </Box>
        <Text>{subtitle}</Text>
        <Box overflow="auto" pad={{ vertical: "medium" }}>
          {content}{" "}
        </Box>
      </Box>
    </Layer>
  );
};

// Get private key content from uploaded file
export const readPrivateKey = (files, callback) => {
  if (files.length === 1) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      callback(e.target.result);
    };
    reader.readAsText(files[0]);
  }
};

export const errorBar = (error, setError) => {
  return error.length > 0 ? (
    <Notification
      status="critical"
      onClose={() => {
        setError([]);
      }}
      message={error.join("\n")}
      global
    />
  ) : (
    <></>
  );
};

export const NavigationCard = ({
  icon,
  title,
  description,
  action,
  background,
  height,
}) => (
  <Card
    width="medium"
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
