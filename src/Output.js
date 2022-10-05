import { Box, TextArea } from "grommet";

export const Output = ({ output }) => {
  return (
    <Box elevation="small" fill>
      <TextArea
        readOnly
        fill
        rows={12}
        resize
        value={output?.join("\n")}
        size="xsmall"
        plain
        style={{
          whiteSpace: "pre",
          fontFamily: "Consolas,Courier New,monospace",
          fontSize: "small",
        }}
      />
    </Box>
  );
};

export default Output;
