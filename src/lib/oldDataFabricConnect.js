import { Box, Button, NameValuePair, Spinner } from "grommet";
import { FormNext } from "grommet-icons";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../ContextProviders";
import { badIcon, goodIcon } from "./Utils";

export const DataFabricConnect = ({ connection, onConnect }) => {
  const [wait, setWait] = useState(false);
  const { output, setOutput } = useContext(AppContext);

  const task_finished =
    output?.some((l) => l.includes("check services")) &&
    output?.some((l) => l.includes("PLAY RECAP"));

  const task_success =
    task_finished &&
    output?.some((l) => l.includes("unreachable=0") && l.includes("failed=0"));

  const service_output =
    task_success && output?.some((l) => l.includes('"SERVICES=='))
      ? JSON.parse(
          output
            .join("") // convert to string
            //TODO: check if string size limits capture
            .match(/(?<=SERVICES==)[\s\S]*(?===END_SERVICES)/)[0]
            .replaceAll("'", '"')
        )
      : null; // task result not found

  const services = service_output?.map((s) => {
    let [name, state] = s.split(" ");
    return { name, state };
  });

  useEffect(() => {
    if (services) {
      onConnect({ dfRunning: services });
      setWait(false);
    }
  }, [onConnect, services]);

  useEffect(() => {
    if (task_finished) setWait(false);
  }, [task_finished]);

  const handleSubmit = () => {
    setWait(true);
    setOutput([]); // clean previous output
    window.ezdemoAPI.ansiblePlay(["services", connection]);
  };

  return (
    <Box gap="small" margin="small">
      {services?.map((srv) => {
        return (
          <NameValuePair key={srv.name} name={srv.name}>
            <Box direction="row" gap="small" align="center">
              {srv.state === "active" ? goodIcon : badIcon}
              {srv.state || "--"}
            </Box>
          </NameValuePair>
        );
      })}
      <Button
        alignSelf="start"
        primary
        disabled={wait}
        label={wait ? "Checking..." : "Check"}
        icon={wait ? <Spinner /> : <FormNext />}
        onClick={handleSubmit}
      />
    </Box>
  );
};

export default DataFabricConnect;
