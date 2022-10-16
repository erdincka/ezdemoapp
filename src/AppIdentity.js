import React, { forwardRef, useContext } from "react";
import PropTypes from "prop-types";
import { Button, Box, Text } from "grommet";
import { Hpe } from "grommet-icons";
import { AppContext } from "./ContextProviders";

const hpe = {
  name: "HPE",
  logo: <Hpe color="brand" />,
};

export const AppIdentity = forwardRef(
  ({ brand, href, logoOnly, title, ...rest }, ref) => {
    const { size } = useContext(AppContext);
    return (
      <Box
        align="center"
        direction="row"
        gap={!["xsmall", "small"].includes(size) ? "medium" : "small"}
      >
        <Button href={href} ref={ref} {...rest} plain>
          <Box
            direction="row"
            align="center"
            gap="medium"
            // pad maintains accessible hit target
            // non-responsive maintains same dimensions for mobile
            pad={{ vertical: "small" }}
            responsive={false}
          >
            {hpe.logo}
            {!logoOnly && (
              <Box direction="row" gap="xsmall" wrap>
                <Box direction="row" gap="xsmall">
                  <Text weight="bold" color="text-strong">
                    {hpe.name}
                  </Text>
                  <Text color="text-strong">{title}</Text>
                </Box>
              </Box>
            )}
          </Box>
        </Button>
      </Box>
    );
  }
);

AppIdentity.propTypes = {
  brand: PropTypes.string.isRequired,
  logoOnly: PropTypes.bool,
  href: PropTypes.string,
  title: PropTypes.string,
};
