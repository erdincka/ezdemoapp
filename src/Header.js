import { Box, Header } from "grommet";
import { useContext } from "react";
import { AppIdentity } from "./AppIdentity";
import { AppContext } from "./ContextProviders";

export const GlobalHeader = ({ buttons }) => {
  const { size } = useContext(AppContext);
  return (
    <Header
      align="center"
      background="background"
      border={{ color: "border-weak", side: "bottom" }}
      justify="between"
      fill="horizontal"
      pad={{
        horizontal: !["xsmall", "small"].includes(size) ? "medium" : "small",
        vertical: "small",
      }}
    >
      <AppIdentity title="Ezdemo" brand="hpe" />
      <Box direction="row">{buttons}</Box>
    </Header>
  );
};

export default GlobalHeader;
