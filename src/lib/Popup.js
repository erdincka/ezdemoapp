import { Box, Button, Heading, Layer, ResponsiveContext, Text } from "grommet";
import { FormClose, FormLock } from "grommet-icons";
import { useContext } from "react";

export const Popup = ({ title, subtitle, content, icon, closer }) => {
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
        width={!["xsmall"].includes(size) ? "medium" : undefined}
        pad="medium"
      >
        <Box justify="between" direction="row">
          <Box flex={false} gap="small" direction="row">
            <Box justify="center">{icon || <FormLock />}</Box>
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
          {content}
        </Box>
      </Box>
    </Layer>
  );
};
