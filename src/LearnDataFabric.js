import { Box, Markdown, Menu, ResponsiveContext } from "grommet";
import { useContext, useState } from "react";

export function LearnDataFabric() {
  const [markdown, setMarkdown] = useState("");

  const md1 = require("./docs/01-IntroductionToDataFabric.md");
  const md2 = require("./docs/02-SizingAndDesignConsiderations.md");
  const md3 = require("./docs/03-CreatingACluster.md");
  const md4 = require("./docs/04-ConfiguringAClient.md");
  const md5 = require("./docs/05-DemoApplications.md");
  const md6 = require("./docs/06-IntegrationWith3rdPartyTools.md");
  const md10 = require("./docs/10-UseCases.md");
  const md99 = require("./docs/99-Troubleshooting.md");
  const markdowns = [md1, md2, md3, md4, md5, md6, md10, md99];

  const size = useContext(ResponsiveContext);

  const getMarkdownFile = (file) => {
    fetch(file)
      .then((response) => response.text())
      .then((text) => setMarkdown(text));
  };

  return (
    <Box flex={false} fill="horizontal">
      <Box
        direction="row"
        align="start"
        justify="between"
        gap="small"
        wrap={["xsmall", "small"].includes(size)}
      >
        <Box
          direction="row"
          align="end"
          gap="small"
          margin={{ bottom: "xsmall" }}
        ></Box>
        <Menu
          alignSelf="start"
          label="Documents"
          items={markdowns.map((m) => {
            let l = {
              label: m.match(/(?<=\d\d-)[\w]*(?=.\S)/)[0],
              onClick: () => {
                getMarkdownFile(m);
              },
            };
            return l;
          })}
        />
      </Box>
      <Box flex={false} fill="horizontal">
        <Markdown children={markdown} />
      </Box>
    </Box>
  );
}
