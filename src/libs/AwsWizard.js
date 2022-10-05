import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Box } from "grommet";
import { WizardContext, WizardHeader, StepContent, StepFooter } from "./Wizard";
import { AWSCredentials } from "./AwsCredentials";
import { AwsInstanceSelect } from "./AwsInstanceSelect";
import { InstancePrecheck } from "./InstancePrecheck";
import { InstanceInstall } from "./InstanceInstall";
import { InstanceSetup } from "./InstanceSetup";

const steps = [
  {
    description: "Enter credentials.",
    inputs: <AWSCredentials />,
    title: "Credentials",
    nextText: "Select Instance",
  },
  {
    description: "Select an Instance.",
    inputs: <AwsInstanceSelect />,
    title: "Instance",
    nextText: "Verify",
  },
  {
    description: "Verify the Instance.",
    inputs: <InstancePrecheck />,
    title: "Verify",
    nextText: "Start Installation",
  },
  {
    description: "Start Installation.",
    inputs: <InstanceInstall />,
    title: "Install",
    nextText: "Setup Cluster",
  },
  {
    description: "Setup the Cluster.",
    inputs: <InstanceSetup />,
    title: "Setup",
    nextText: "Close the Wizard and Continue...",
  },
];

export const AwsWizard = ({ closer }) => {
  // const size = useContext(ResponsiveContext);
  const [activeIndex, setActiveIndex] = useState(0);
  // for readability, this is used to display numeric value of step on screen,
  // such as step 1 of 3. it will always be one more than the active array index
  const [activeStep, setActiveStep] = useState(activeIndex + 1);

  // ref allows us to access the wizard container and ensure scroll position
  // is at the top as user advances between steps. useEffect is triggered
  // when the active step changes.
  const wizardRef = useRef();

  const [valid, setValid] = useState(false);

  useEffect(() => {
    setActiveStep(activeIndex + 1);
  }, [activeIndex]);

  const id = "sticky-header-wizard";

  // scroll to top of step when step changes
  React.useEffect(() => {
    const container = wizardRef.current;
    const header = document.querySelector(`#${id}`);
    container.scrollTop = -header.getBoundingClientRect().bottom;
  }, [activeIndex]);

  const contextValue = useMemo(
    () => ({
      activeIndex,
      id,
      setActiveIndex,
      activeStep,
      setActiveStep,
      ref: wizardRef,
      steps,
      valid,
      setValid,
      wizardTitle: "Select AWS Resources",
    }),
    [activeIndex, activeStep, valid]
  );

  return (
    <WizardContext.Provider value={contextValue}>
      <Box fill>
        <WizardHeader closer={closer} />
        <StepContent setValid={setValid} />
        <StepFooter
          onSubmit={(data) => console.log("onSubmit:", data)}
          valid={valid}
        />
      </Box>
    </WizardContext.Provider>
  );
};

AwsWizard.propTypes = {
  containerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};