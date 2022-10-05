import { Box, FileInput, NameValueList, NameValuePair, Text } from "grommet";
import { StatusCriticalSmall, StatusGoodSmall } from "grommet-icons";
import { useContext, useEffect, useState } from "react";
import { InstanceContext } from "../ContextProviders";
import { WizardContext } from "./Wizard";

export function InstancePrecheck() {
  const [privatekey, setPrivateKey] = useState();
  const [output, setOutput] = useState([]);

  const { setValid } = useContext(WizardContext);
  const { instance } = useContext(InstanceContext);

  useEffect(() => {
    const outputListener = (data) => {
      setOutput([...output, data]);
    };
    window.ezdemoAPI.getOutput((data) => outputListener(data));
  }, [output]);
  // Output data capture
  // const ezdemo_out = /(?<=\[ezdemo_out\] )(.*)(?=PLAY RECAP)/;
  // const ignore_beginning = /.+?(?==> )(.*)/;
  const total_memory_mb = output
    ?.find((l) => l.includes("total_memory_mb="))
    ?.match(/total_memory_mb=(?<mem>\d+)/)[1];
  const total_swap_mb = output
    ?.find((l) => l.includes("total_swap_mb="))
    ?.match(/total_swap_mb=(\d+)/)[1];

  // TODO: Set min requirements globally
  const min_memory_mb = 600;
  const min_swap_mb = -1; // Math.ceil(total_memory_mb * 0.2);
  const has_enough_memory = total_memory_mb > min_memory_mb;
  const has_enough_swap = total_swap_mb > min_swap_mb;

  useEffect(() => {
    const queryAsync = async () => {
      setPrivateKey(await window.ezdemoAPI.getPrivateKey());
    };
    queryAsync();
  }, []);

  useEffect(() => {
    const gatherFacts = async () => {
      let vars = {
        ip: instance.PublicIpAddress,
        // TODO: username should be fixed for AWS/Azure/Vmware images
        username:
          instance.PlatformDetails === "Linux/UNIX" ? "ubuntu" : "ec2-user",
        privatekey: privatekey,
      };
      window.ezdemoAPI.ansiblePlay(["check", vars]);
    };
    if (privatekey) {
      window.ezdemoAPI.savePrivateKey(privatekey);
      gatherFacts();
    } else setValid(false);
  }, [instance, privatekey, setValid]);

  useEffect(() => {
    if (has_enough_memory && has_enough_swap) setValid(true);
  }, [has_enough_memory, has_enough_swap, setValid]);

  // Get private key content from uploaded file
  const readPrivateKey = (files) => {
    if (files.length === 1) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        setPrivateKey(e.target.result);
      };
      reader.readAsText(files[0]);
    }
  };

  return (
    <Box margin="medium">
      <FileInput
        name="privatekey"
        multiple={false}
        onChange={({ target: { files } }) => {
          readPrivateKey(files);
        }}
      />
      <Text weight="bold">Result</Text>
      <NameValueList>
        <NameValuePair name="Total Memory (MB)">
          <Text color="text-strong">{total_memory_mb}</Text>
          {has_enough_memory ? (
            <StatusGoodSmall color="status-ok" />
          ) : (
            <StatusCriticalSmall color="status-critical" />
          )}
        </NameValuePair>
        <NameValuePair name="Total Swap (MB)">
          <Text color="text-strong">{total_swap_mb}</Text>
          {has_enough_swap ? (
            <StatusGoodSmall color="status-ok" />
          ) : (
            <StatusCriticalSmall color="status-critical" />
          )}
        </NameValuePair>
      </NameValueList>
    </Box>
  );
}

export default InstancePrecheck;
