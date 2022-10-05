import { Box, Button, Heading, Layer, ResponsiveContext, Text } from "grommet";
import {
  FormClose,
  FormLock,
  StatusCriticalSmall,
  StatusGoodSmall,
} from "grommet-icons";
import PropTypes from "prop-types";
import { useContext } from "react";

export const Identifier = ({ title, subtitle, icon }) => (
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

Identifier.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  icon: PropTypes.node,
};

export const goodIcon = <StatusGoodSmall color="status-ok" />;
export const badIcon = <StatusCriticalSmall color="status-critical" />;

export const getInstanceName = (instance) =>
  instance.Tags.filter((t) => t.Key === "Name").map((t) => t.Value);

export const Popup = ({ title, subtitle, content, closer }) => {
  const size = useContext(ResponsiveContext);

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
