import { Button, Form, FormField, Spinner, TextInput } from "grommet";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../ContextProviders";
import { getAnsibleResponse } from "../getAnsibleResponse";
import { runAnsible } from "../Utils";

export function VmwareLogin() {
  const [credentials, setCredentials] = useState({
    address: "",
    username: "",
    password: "",
  });
  const [wait, setWait] = useState(false);

  const { output, setOutput, client, setClient, setError } =
    useContext(AppContext);

  // get saved credentials
  useEffect(() => {
    window.ezdemoAPI
      .getCredentials("vmware")
      .then((c) => {
        if (c) {
          setCredentials(JSON.parse(c));
        }
      })
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    if (wait && output.length > 0) {
      getAnsibleResponse(output, "vconnect")
        .then((data) => {
          console.dir(data);
          setClient(data);
          setWait(false);
        })
        .catch((error) => {
          setError((prev) => [...prev, error]);
          setWait(false);
        });
    }
  }, [output, setClient, setError, wait]);

  const handleSubmit = () => {
    setWait(true);
    setOutput([]);

    const vars = {
      address: credentials.address,
      username: credentials.username,
      password: credentials.password,
    };
    runAnsible("vconnect", vars);
    window.ezdemoAPI.saveCredentials({ vmware: credentials });
  };

  return (
    <Form
      value={credentials}
      onChange={setCredentials}
      onSubmit={handleSubmit}
      validate="submit"
    >
      <FormField
        name="address"
        htmlFor="address"
        label="vCenter Host"
        required
        margin="small"
      >
        <TextInput id="address" name="address" />
      </FormField>
      <FormField
        name="username"
        htmlFor="username"
        label="vCenter User"
        required
        margin="small"
      >
        <TextInput id="username" name="username" />
      </FormField>
      <FormField
        name="password"
        htmlFor="password"
        label="Password"
        required
        margin="small"
      >
        <TextInput id="password" name="password" type="password" />
      </FormField>
      <Button
        margin="small"
        label={wait ? "Connecting" : client?.vmware ? "Connected" : "Connect"}
        icon={wait ? <Spinner /> : <></>}
        reverse
        primary={!client}
        secondary={client ? true : false}
        disabled={wait}
        type="submit"
      />
    </Form>
  );
}
