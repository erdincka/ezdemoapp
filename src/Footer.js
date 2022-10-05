import React from "react";
import { Box, Button, Footer, Text } from "grommet";
import { Hpe } from "grommet-icons";

const footerButtons = [
  {
    label: "Learn",
    href: "//learn.ezmeral.software.hpe.com/",
  },
  {
    label: "Workshop",
    href: "//hackshack.hpedev.io/workshops",
  },
  {
    label: "Demo",
    href: "//www.hpe.com/demos/ezmeral",
  },
];

export const GlobalFooter = () => {
  const year = new Date().getFullYear();

  return (
    <Footer
      background="background"
      direction="row-responsive"
      pad={{ horizontal: "medium", vertical: "small" }}
      wrap
    >
      <Box direction="row" gap="medium">
        <Hpe color="plain" />
        <Text size="small">
          © {year} Hewlett Packard Enterprise Development LP
        </Text>
      </Box>
      <Box align="center" direction="row" wrap>
        {footerButtons.map((button, index) => (
          <Button
            key={index}
            label={button.label}
            href={button.href}
            rel="noopener"
            target="_blank"
          />
        ))}
      </Box>
    </Footer>
  );
};

export default GlobalFooter;
