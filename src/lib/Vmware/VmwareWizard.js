import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Box } from "grommet";
import { WizardContext, StepContent, StepFooter } from "../Wizard";
import { VmwareCredentials } from "./VmwareCredentials";
import { VmwareContext } from "../../ContextProviders";
import VmwareResources from "./VmwareResources";

const steps = [
  {
    title: "Credentials",
    description: "",
    inputs: <VmwareCredentials />,
    nextText: "Next",
    waitingText: "Credentials not verified",
  },
  {
    title: "Select Resources",
    description: "",
    inputs: <VmwareResources />,
    nextText: "Finish",
    waitingText: "Verify connection",
  },
];

export const VmwareWizard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(activeIndex + 1);
  // ref allows us to access the wizard container and ensure scroll position
  // is at the top as user advances between steps. useEffect is triggered
  // when the active step changes.
  const wizardRef = useRef();

  const [valid, setValid] = useState(false);
  const [client, setClient] = useState();

  useEffect(() => {
    setActiveStep(activeIndex + 1);
  }, [activeIndex]);

  const id = "sticky-header-wizard";

  // scroll to top of step when step changes
  useEffect(() => {
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
    }),
    [activeIndex, activeStep, valid]
  );

  const AwsContextValue = useMemo(
    () => ({
      client,
      setClient,
    }),
    [client]
  );

  return (
    <WizardContext.Provider value={contextValue}>
      <Box elevation="small" border="horizontal" margin="small">
        {/* <WizardHeader closer={closer} /> */}
        <VmwareContext.Provider value={AwsContextValue}>
          <StepContent setValid={setValid} />
          <StepFooter valid={valid} />
        </VmwareContext.Provider>
      </Box>
    </WizardContext.Provider>
  );
};

VmwareWizard.propTypes = {
  containerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};
