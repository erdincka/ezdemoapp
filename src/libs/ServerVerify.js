import { Box, Button, NameValueList, NameValuePair, Spinner } from "grommet";
import { Resources, Run } from "grommet-icons";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../ContextProviders";
import { badIcon, goodIcon, NavigationCard } from "./Utils";

export function ServerVerify() {
  const [wait, setWait] = useState(false);

  const { output, setOutput, connection, setConnection } =
    useContext(AppContext);

  // process output
  const total_memory_mb = output
    ?.find((l) => l.includes("total_memory_mb="))
    ?.match(/total_memory_mb=(?<mem>\d+)/)[1];
  const total_swap_mb = output
    ?.find((l) => l.includes("total_swap_mb="))
    ?.match(/total_swap_mb=(?<swap>\d+)/)[1];
  const available_disks = output
    ?.find((l) => l.includes("available_disks="))
    ?.match(/(?<="available_disks=)(.*)(?=")/)[1];

  const task_finished = output?.some((l) => l.includes("PLAY RECAP"));

  // TODO: Set min requirements globally
  const min_memory_mb = 63000; // 64GB required, but AWS instances report 63xxx MB available
  const min_swap_mb = Math.ceil(total_memory_mb * 0.2);
  const has_enough_memory = total_memory_mb > min_memory_mb;
  const has_enough_swap = total_swap_mb > min_swap_mb;
  const has_available_disks = available_disks?.length > 0;

  useEffect(() => {
    if (task_finished) {
      setWait(false);
      if (has_available_disks && has_enough_memory) {
        setConnection((old) => {
          return { ...old, canInstall: true };
        });
      }
    }
  }, [has_available_disks, has_enough_memory, setConnection, task_finished]);

  const handleClick = () => {
    setWait(true);
    setOutput([]); // clean previous output
    let vars = {
      address: connection.address,
      username: connection.username,
      privatekey: connection.privatekey,
    };
    window.ezdemoAPI.ansiblePlay(["df-preinstall", vars]);
  };

  const pairs = [
    {
      name: "Memory (MB)",
      value: total_memory_mb,
      valid: has_enough_memory,
    },
    {
      name: "Swap (MB)",
      value: total_swap_mb,
      valid: has_enough_swap,
    },
    {
      name: "Disks",
      value: available_disks,
      valid: has_available_disks,
    },
  ];

  return (
    <Box direction="row" gap="medium">
      <NavigationCard
        icon={<Resources />}
        title="Resources"
        description={
          <NameValueList pairProps={{ direction: "column" }}>
            {pairs.map((pair) => (
              <NameValuePair key={pair.name} name={pair.name}>
                <Box direction="row" gap="small" align="center">
                  {pair.valid ? goodIcon : badIcon}
                  {pair.value || "--"}
                </Box>
              </NameValuePair>
            ))}
          </NameValueList>
        }
        background={
          connection?.connected ? "background-front" : "background-back"
        }
        height="medium"
        action={
          <Button
            alignSelf="start"
            primary
            disabled={wait}
            label={wait ? "Checking..." : "Check"}
            icon={wait ? <Spinner /> : <Run />}
            onClick={handleClick}
          />
        }
      />
    </Box>
  );
}
