import {
  Box,
  Button,
  FileInput,
  NameValueList,
  NameValuePair,
  Text,
} from "grommet";
import {
  StatusCriticalSmall,
  StatusGoodSmall,
  StatusWarningSmall,
} from "grommet-icons";
import { useContext, useEffect, useState } from "react";
import { AppContext, InstanceContext } from "../ContextProviders";
import { WizardContext } from "./Wizard";

export function InstancePrecheck() {
  const [privatekey, setPrivateKey] = useState();
  const [wait, setWait] = useState(false);

  const { instance } = useContext(InstanceContext);
  const { output } = useContext(AppContext);
  const { setValid } = useContext(WizardContext);

  const total_memory_mb = output
    ?.find((l) => l.includes("total_memory_mb="))
    ?.match(/total_memory_mb=(?<mem>\d+)/)[1];
  const total_swap_mb = output
    ?.find((l) => l.includes("total_swap_mb="))
    ?.match(/total_swap_mb=(?<swap>\d+)/)[1];
  const available_disks = output
    ?.find((l) => l.includes("available_disks="))
    ?.match(/available_disks=(?<disks>.*)/)[1]
    .replace('"', "")
    .split("\n");

  // TODO: Set min requirements globally
  const min_memory_mb = 63000; // 64GB required, but AWS instances report 63xxx MB available
  const min_swap_mb = Math.ceil(total_memory_mb * 0.2);
  const has_enough_memory = total_memory_mb > min_memory_mb;
  const has_enough_swap = total_swap_mb > min_swap_mb;
  const has_available_disks = available_disks?.length > 0;

  useEffect(() => {
    const queryAsync = async () => {
      setPrivateKey(await window.ezdemoAPI.getPrivateKey());
    };
    queryAsync();
    setValid(false);
  }, [setValid]);

  useEffect(() => {
    if (has_enough_memory && has_available_disks) {
      setValid(true);
      setWait(false);
    }
  }, [has_available_disks, has_enough_memory, setValid]);

  // Get private key content from uploaded file
  const readPrivateKey = (files) => {
    if (files.length === 1) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        window.ezdemoAPI.savePrivateKey(e.target.result);
        setPrivateKey(e.target.result);
      };
      reader.readAsText(files[0]);
    }
  };

  const handleClick = () => {
    setWait(true);
    let vars = {
      ip: instance.PublicIpAddress,
      // TODO: username should be fixed for AWS/Azure/Vmware images
      username:
        instance.PlatformDetails === "Linux/UNIX" ? "ubuntu" : "ec2-user",
    };
    window.ezdemoAPI.ansiblePlay(["check", vars]);
  };

  return (
    <Box>
      <Box direction="row" gap="medium">
        <FileInput
          name="privatekey"
          multiple={false}
          onChange={({ target: { files } }) => {
            readPrivateKey(files);
          }}
        />
        <Button
          primary
          disabled={!privatekey || wait}
          label={
            wait ? "Checking..." : privatekey ? "Check" : "Private Key required"
          }
          onClick={handleClick}
        />
      </Box>
      <Text weight="bold">Result</Text>
      <NameValueList>
        <NameValuePair name="Total Memory (MB)">
          <Text>
            {has_enough_memory ? (
              <StatusGoodSmall color="status-ok" />
            ) : (
              <StatusCriticalSmall color="status-critical" />
            )}
            {total_memory_mb}
          </Text>
        </NameValuePair>
        <NameValuePair name="Total Swap (MB)">
          <Text>
            {has_enough_swap ? (
              <StatusGoodSmall color="status-ok" />
            ) : (
              <StatusWarningSmall color="status-warning" />
            )}
            {total_swap_mb}
          </Text>
        </NameValuePair>
        <NameValuePair name="Available Disks">
          <Text>
            {has_available_disks ? (
              <StatusGoodSmall color="status-ok" />
            ) : (
              <StatusCriticalSmall color="status-critical" />
            )}
            {available_disks}
          </Text>
        </NameValuePair>
      </NameValueList>
    </Box>
  );
}

export default InstancePrecheck;
