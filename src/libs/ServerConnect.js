import {
  Button,
  FileInput,
  Form,
  FormField,
  Spinner,
  TextInput,
} from "grommet";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../ContextProviders";
import { readPrivateKey } from "./Utils";

export const ServerConnect = () => {
  const { output, setOutput, setConnection, connection } =
    useContext(AppContext);

  const [formValue, setFormValue] = useState({
    address: connection?.address || "",
    username: connection?.username || "",
    privatekey: null,
  });

  const [privatekey, setPrivatekey] = useState();
  const [wait, setWait] = useState(false);

  useEffect(() => {
    const queryAsync = async () => {
      setPrivatekey(await window.ezdemoAPI.getPrivateKey());
    };
    queryAsync();
  }, []);

  // monitor output for success
  const task_finished = output?.some((l) => l.includes("PLAY RECAP"));
  const connected =
    task_finished &&
    output.some((l) => l.includes("unreachable=0") && l.includes("failed=0"));

  useEffect(() => {
    if (task_finished) setWait(false);
  }, [task_finished]);

  useEffect(() => {
    if (connected) {
      setConnection((old) => {
        return {
          ...old,
          connected,
        };
      });
    }
  }, [connected, setConnection]);

  const handleSubmit = ({ value }) => {
    setWait(true);
    setOutput([]); // clean up previus output
    let connection = {
      address: value.address,
      username: value.username,
      privatekey,
    };
    setConnection(connection);
    window.ezdemoAPI.ansiblePlay(["connect", connection]);
  };

  return (
    <Form
      value={formValue}
      onChange={setFormValue}
      onSubmit={handleSubmit} // include rendered privatekey
      validate="submit"
    >
      <FormField
        name="address"
        htmlFor="address"
        label="Host"
        required={{ indicator: false }}
        margin="small"
      >
        <TextInput
          id="address"
          name="address"
          placeholder="Hostname or IP Address"
        />
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
          onChange={(event, { files }) => readPrivateKey(files, setPrivatekey)}
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
    </Form>
  );
};
