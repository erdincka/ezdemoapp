import { Box, Heading, List, ResponsiveContext, Text } from "grommet";
import { useContext, useState } from "react";

export const Vcenter = () => {
  const [vms, setVms] = useState();
  const size = useContext(ResponsiveContext);

  const handleSelect = (vm) => {
    console.dir(vm);
  };

  return (
    <Box margin="small" gap="small">
      <Heading level={5}>Virtual Machines</Heading>
      {/* <Button icon={<Connect />} kind="toolbar" onClick={() => setOpen(true)} /> */}
      <List
        data={vms}
        pad="small"
        action={(item, index) => (
          <Box key={index} direction="row" align="center" gap="medium">
            {!["xsmall", "small"].includes(size) && (
              <Text
                weight="bold"
                size="xsmall"
                color={!item.verified ? "text-weak" : null}
              ></Text>
            )}
          </Box>
        )}
        onClickItem={(e) => handleSelect(e.item)}
        margin={
          ["xsmall", "small"].includes(size) ? { bottom: "large" } : undefined
        }
      >
        {(vm, index) => (
          <Box
            key={index}
            gap="medium"
            direction="row"
            align="center"
            justify="between"
          >
            <Box alignSelf="center">Name</Box>
            <Box align="center" gap="medium">
              <Box>
                <Text weight="bold" color="text-weak">
                  VM Name
                </Text>
                <Text color="text-weak">VM IP</Text>
              </Box>
            </Box>
          </Box>
        )}
      </List>
    </Box>
  );
};
