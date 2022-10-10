import { Box, ThemeContext } from "grommet";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "grommet-theme-hpe";
import { useContext } from "react";

export const LogViewer = ({ lines }) => {
  const theme = useContext(ThemeContext);

  return (
    <Box elevation="small">
      {/* <TextArea
        readOnly
        fill
        resize
        value={lines?.join("\n")}
        size="xsmall"
        style={{
          whiteSpace: "pre",
          fontFamily: "Consolas,Courier New,monospace",
          fontSize: "small",
        }}
      /> */}
      <SyntaxHighlighter
        style={theme.dark ? prism.dark : prism.light}
        wrapLongLines
        language="log"
      >
        {lines?.join("\n")}
      </SyntaxHighlighter>
    </Box>
  );
};

export default LogViewer;
