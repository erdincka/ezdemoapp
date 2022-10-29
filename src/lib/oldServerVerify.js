import { Box, Button, NameValueList, NameValuePair, Spinner } from "grommet";
import { Resources, Run } from "grommet-icons";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../ContextProviders";
import { badIcon, goodIcon } from "./Utils";
import { NavigationCard } from "./NavigationCard";

export function ServerVerify() {
  const [wait, setWait] = useState(false);

  const { output, setOutput, connection, setConnection } =
    useContext(AppContext);

  const task_finished =
    output?.some((l) => l.includes("Data Fabric pre-install verification")) &&
    output?.some((l) => l.includes("PLAY RECAP"));

  // process output if component is not frozen
  const frozen = output?.join(" ");
  const total_cores = (frozen?.match(/total_cores=(?<cores>\d+)/) || [
    null,
    null,
  ])[1];
  const total_memory_mb = (frozen?.match(/total_memory_mb=(?<mem>\d+)/) || [
    null,
    null,
  ])[1];
  const total_swap_mb = (frozen?.match(/total_swap_mb=(?<swap>\d+)/) || [
    null,
    null,
  ])[1];
  const available_disks = (frozen?.match(/(?<="available_disks=)(.*)(?=")/) || [
    null,
    null,
  ])[1];

  // TODO: Set min requirements globally
  const min_memory_mb = 63000; // 64GB required, but AWS instances report 63xxx MB available
  const min_swap_mb = Math.ceil(total_memory_mb * 0.2);
  const has_enough_memory = total_memory_mb > min_memory_mb;
  const has_enough_swap = total_swap_mb > min_swap_mb;
  const has_available_disks = available_disks?.length > 0;
  const has_enough_cores = total_cores > 16;

  useEffect(() => {
    if (task_finished) {
      setWait(false);
      if (has_available_disks && has_enough_memory) {
        setConnection((old) => {
          return {
            ...old,
            canInstall: {
              total_cores,
              total_memory_mb,
              total_swap_mb,
              available_disks,
            },
          };
        });
      }
    }
  }, [
    available_disks,
    has_available_disks,
    has_enough_memory,
    setConnection,
    task_finished,
    total_cores,
    total_memory_mb,
    total_swap_mb,
  ]);

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
      name: "Cores",
      value: total_cores,
      valid: has_enough_cores,
    },
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
        title="Verify"
        description={
          <NameValueList>
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
