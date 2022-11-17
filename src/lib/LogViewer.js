import { Box, CheckBox, Heading, ThemeContext } from "grommet";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "grommet-theme-hpe";
import { useContext, useState } from "react";

export const LogViewer = ({ lines, header = "Task Output" }) => {
  const [full, setFull] = useState(false);
  const theme = useContext(ThemeContext);

  return (
    <Box style={{ fontSize: "small" }} height="medium">
      <Box direction="row" justify="between" align="center">
        <Heading level={4}>{header}</Heading>
        <CheckBox
          reverse
          pad="none"
          label={full ? "Showing full log" : "Showing recent logs"}
          checked={full}
          onChange={(event) => setFull(event.target.checked)}
          toggle
        />
      </Box>
      <SyntaxHighlighter
        style={theme.dark ? prism.dark : prism.light}
        wrapLongLines
        language="log"
      >
        {full ? lines?.join("\n") : lines?.slice(-3).join("\n")}
      </SyntaxHighlighter>
    </Box>
  );
};
