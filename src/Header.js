import { Box, Header, ResponsiveContext } from "grommet";
import { useContext } from "react";
import { AppIdentity } from "./AppIdentity";

export const GlobalHeader = ({ buttons }) => {
  const size = useContext(ResponsiveContext);

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
      <AppIdentity title="Ezdemo" brand="hpe" href="/" />
      <Box direction="row">{buttons}</Box>
    </Header>
  );
};

export default GlobalHeader;
