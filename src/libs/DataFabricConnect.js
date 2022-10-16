import { Box, Button, Spinner, Text } from "grommet";
import { FormNext } from "grommet-icons";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../ContextProviders";
import { ServerConnect } from "./ServerConnect";

export const DataFabricConnect = () => {
  const [wait, setWait] = useState(false);
  const { connection, setConnection } = useContext(AppContext);
  const { output, setOutput } = useContext(AppContext);

  const task_finished = output?.some((l) => l.includes("PLAY RECAP"));
  const task_success = output?.some(
    (l) => l.includes("unreachable=0") && l.includes("failed=0")
  );

  const services =
    task_finished &&
    task_success &&
    output?.some((l) => l.includes('"ansible_facts": {"services": '))
      ? JSON.parse(
          output
            .join("") // convert to string (TODO: check if string size limits capture)
            .match(
              /(?<="ansible_facts": {"services": )[\s\S]*(?=}, "changed": false)/
            )[0]
            .replace("\\n", "")
        )
      : null; // task result not found

  const warden_service = services ? services["mapr-warden.service"] : null;
  const zk_service = services ? services["mapr-zookeeper.service"] : null;
  const warden_running = warden_service?.state === "running";
  const zk_running = zk_service?.state === "running";

  useEffect(() => {
    if (warden_running && zk_running) {
      setConnection((old) => {
        return { ...old, dfRunning: true };
      });
      setWait(false);
    }
  }, [setConnection, warden_running, zk_running]);

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
      {connection.connected ? (
        <Box>
          <Text color="text-strong" weight="bold">
            Connected to: {connection.address}
          </Text>
          <Text color="text-strong">
            Services:{" "}
            {task_finished
              ? warden_running && zk_running
                ? "OK"
                : "Not running"
              : "Not checked"}
          </Text>
          <Button
            primary
            alignSelf="start"
            label="Check Services"
            onClick={handleSubmit}
            reverse
            icon={wait ? <Spinner /> : <FormNext />}
            disabled={wait}
          />
        </Box>
      ) : (
        <ServerConnect />
      )}
    </Box>
  );
};

export default DataFabricConnect;
