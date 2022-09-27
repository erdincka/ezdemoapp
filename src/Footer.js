import React, { Fragment } from "react";
import { Anchor, Box, Footer, Text } from "grommet";
import { StatusCritical, StatusGood } from "grommet-icons";

export const FooterWithActions = (props) => {
  const { error } = props.params;
  return (
    <Box justify="end">
      <Box
        direction="row"
        justify="between"
        border="between"
        gap="xsmall"
        margin="xsmall"
      >
        <Anchor
          href="https://learn.ezmeral.software.hpe.com/"
          label="Discover"
          target="_blank"
        />
        <Anchor
          href="https://hackshack.hpedev.io/workshops"
          label="Experience"
          target="_blank"
        />
        <Anchor
          href="https://www.hpe.com/demos/ezmeral"
          label="Show"
          target="_blank"
        />
      </Box>

      <Footer background="brand" pad="xsmall">
        <Fragment>
          {error.length > 0 ? (
            <StatusCritical color="status-critical" />
          ) : (
            <StatusGood color="status-ok" />
          )}
          {error.length > 0 && (
            <Box basis="small">
              <Text truncate="tip" color="red">
                {error}
              </Text>
            </Box>
          )}
        </Fragment>
        <Box direction="row">
          <Text wordBreak="keep-all" margin={{ right: "small" }}>
            HPE Ezmeral @2022{" "}
          </Text>
          <Anchor
            label="About"
            href="https://github.com/hewlettpackard/ezdemo"
            target="_blank"
          />
        </Box>
      </Footer>
    </Box>
  );
};

export default FooterWithActions;
