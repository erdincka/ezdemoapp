import React, { useContext } from "react";
import { Box, Button, Footer, ResponsiveContext, Spinner } from "grommet";
import { FormNextLink } from "grommet-icons";
import { WizardContext } from ".";

export const StepFooter = ({ onSubmit, valid }) => {
  const size = useContext(ResponsiveContext);
  const { activeIndex, setActiveIndex, id, steps, width } =
    useContext(WizardContext);

  const handleSubmit = (event) => {
    if (activeIndex < steps.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (onSubmit) {
      onSubmit(event);
    }
  };

  return (
    <Box
      margin={
        !["xsmall", "small"].includes(size)
          ? { horizontal: "medium" }
          : undefined
      }
      flex={false}
    >
      <Footer
        border={{ side: "top", color: "border" }}
        justify="end"
        pad={
          !["xsmall", "small"].includes(size)
            ? { vertical: "medium" }
            : { vertical: "small", horizontal: "medium" }
        }
        alignSelf="center"
        width={width}
      >
        <Button
          icon={<FormNextLink />}
          primary
          reverse
          disabled={!valid}
          // label={activeIndex === steps.length - 1 ? "Finish Wizard" : "Next"}
          label={steps[activeIndex].nextText}
          form={`${id}-form`}
          onClick={handleSubmit}
        />
        {!valid && <Spinner message="Wait while validating..." />}
      </Footer>
    </Box>
  );
};
