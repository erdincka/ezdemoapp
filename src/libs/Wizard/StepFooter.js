import React, { useContext } from "react";
import { Box, Button, Footer } from "grommet";
import { FormNextLink } from "grommet-icons";
import { WizardContext } from ".";
import { AppContext } from "../../ContextProviders";

export const StepFooter = ({ valid }) => {
  const { activeIndex, setActiveIndex, id, steps, width } =
    useContext(WizardContext);
  const { size } = useContext(AppContext);

  const handleSubmit = (event) => {
    if (activeIndex < steps.length - 1) {
      setActiveIndex(activeIndex + 1);
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
        {activeIndex !== steps.length - 1 && (
          <Button
            icon={<FormNextLink />}
            primary
            reverse
            disabled={!valid}
            label={
              valid
                ? steps[activeIndex].nextText
                : steps[activeIndex].waitingText
            }
            form={`${id}-form`}
            onClick={handleSubmit}
          />
        )}
      </Footer>
    </Box>
  );
};
