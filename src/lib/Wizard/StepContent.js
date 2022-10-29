import React, { useContext } from "react";
import { Box, ResponsiveContext } from "grommet";
import { StepHeader, WizardContext } from ".";

export const StepContent = () => {
  const { activeIndex, ref, steps, width } = useContext(WizardContext);
  const size = useContext(ResponsiveContext);

  return (
    <Box
      align="center"
      pad={
        !["xsmall", "small"].includes(size)
          ? { vertical: "large" }
          : { vertical: "medium" }
      }
      overflow="auto"
      ref={ref}
      flex={["xsmall", "small"].includes(size) ? true : undefined}
      margin={
        !["xsmall", "small"].includes(size)
          ? { horizontal: "medium" }
          : undefined
      }
    >
      <Box
        width={width}
        gap="medium"
        pad={
          ["xsmall", "small"].includes(size)
            ? { horizontal: "medium" }
            : "xxsmall"
        }
      >
        <StepHeader />
        <Box margin={{ top: "small" }}>{steps[activeIndex].inputs}</Box>
      </Box>
    </Box>
  );
};
