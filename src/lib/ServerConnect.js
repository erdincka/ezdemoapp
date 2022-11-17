import {
  Button,
  FileInput,
  Form,
  FormField,
  Spinner,
  Text,
  TextInput,
} from "grommet";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../ContextProviders";
import { getMatchBetweenRegex, readSingleFile, runAnsible } from "./Utils";

export const ServerConnect = ({ onConnect, host, user }) => {
  const { output, setOutput } = useContext(AppContext);

  const [formValue, setFormValue] = useState({
    address: host || "",
    username: user || "",
    privatekey: null,
  });

  const [privatekey, setPrivatekey] = useState();
  const [wait, setWait] = useState(false);

  useEffect(() => {
    // const queryAsync = async () => {
    //   setPrivatekey(await window.ezdemoAPI.getPrivateKey());
    // };
    // queryAsync();
    const savedKey = localStorage.getItem("privatekey");
    if (savedKey) setPrivatekey(savedKey);
  }, []);

  // monitor output for success
  const task_finished = output?.some(
    (l) => l.includes("SUCCESS =>") || l.includes("UNREACHABLE! =>")
  );
  const connected = output?.some((l) => l.includes('"ping": "pong"'));

  const task_fail = output?.some((l) => l.includes("UNREACHABLE! =>"))
    ? getMatchBetweenRegex(output.join(""), '"msg": "', '",')
    : false;

  useEffect(() => {
    if (task_finished) setWait(false);
  }, [task_finished]);

  useEffect(() => {
    if (connected) {
      setOutput([]);
      onConnect({ ...formValue, privatekey });
    }
  }, [connected, formValue, onConnect, privatekey, setOutput]);

  const handleSubmit = ({ value }) => {
    setWait(true);
    setOutput([]);
    let newConnection = {
      // clean up whitespace coming from copy-paste
      address: value.address.replaceAll(/\s/g, ""),
      username: value.username.replaceAll(/\s/g, ""),
      privatekey,
    };
    const didRun = runAnsible("ping", newConnection);
    if (didRun) localStorage.setItem("privatekey", privatekey);
  };

  return (
    <Form
      value={formValue}
      onChange={setFormValue}
      onSubmit={handleSubmit}
      validate="submit"
    >
      <FormField
        name="address"
        htmlFor="address"
        label="Host"
        required={{ indicator: false }}
        margin="small"
      >
        <TextInput id="address" name="address" placeholder="IP or FQDN" />
      </FormField>
      <FormField
        name="username"
        htmlFor="username"
        label="Username"
        required={{ indicator: false }}
        basis="2/3"
        margin="small"
      >
        <TextInput id="username" name="username" placeholder="Username" />
      </FormField>
      <FormField
        name="keyfile"
        htmlFor="keyfile"
        label="Private Key"
        required={privatekey ? false : { indicator: false }}
        margin="small"
      >
        <FileInput
          name="keyfile"
          id="keyfile"
          messages={{
            dropPrompt: "Drag private key file",
            browse: privatekey ? "Replace File" : "Select File",
          }}
          multiple={false}
          onChange={(event, { files }) => readSingleFile(files, setPrivatekey)}
        />
      </FormField>
      <Button
        margin="small"
        label={wait ? "Connecting" : connected ? "Reconnect" : "Connect"}
        icon={wait ? <Spinner /> : <></>}
        reverse
        primary={!connected}
        disabled={wait}
        type="submit"
      />
      <Text color="status-critical">{task_fail}</Text>
    </Form>
  );
};
