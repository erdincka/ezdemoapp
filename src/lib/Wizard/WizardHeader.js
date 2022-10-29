import React, { useContext } from "react";
import { Box, Button, Header, ResponsiveContext, Text } from "grommet";
import { FormClose, FormPreviousLink } from "grommet-icons";
import { WizardContext } from ".";

export const WizardHeader = ({ closer }) => {
  const { activeIndex, activeStep, setActiveIndex, steps, wizardTitle } =
    useContext(WizardContext);
  const size = useContext(ResponsiveContext);

  return (
    <Header background="background-contrast" pad="small" responsive={false}>
      <Box
        direction="row"
        align="center"
        width={{ max: "xxlarge" }}
        margin="auto"
        justify="center"
        fill="horizontal"
      >
        <Box direction="row" flex>
          {activeStep > 1 && (
            <Button
              label={
                !["xsmall", "small"].includes(size)
                  ? (steps[activeIndex - 1] && steps[activeIndex - 1].title) ||
                    `Step ${activeStep - 1} Title`
                  : undefined
              }
              icon={<FormPreviousLink />}
              onClick={() => setActiveIndex(activeIndex - 1)}
            />
          )}
        </Box>
        <Box>
          <Text color="text-strong" weight="bold">
            {wizardTitle}
          </Text>
        </Box>
        <Box direction="row" flex justify="end">
          <Button
            label={!["xsmall", "small"].includes(size) ? "Cancel" : undefined}
            icon={<FormClose />}
            reverse
            onClick={closer}
          />
        </Box>
      </Box>
    </Header>
  );
};
