import { Button, Form, FormField, Spinner, Text, TextInput } from "grommet";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../ContextProviders";
// import { getAnsibleResponse } from "../getAnsibleResponse";

export function VmwareLogin({ onSuccess }) {
  const [credentials, setCredentials] = useState({
    address: "",
    username: "",
    password: "",
  });
  const [wait, setWait] = useState(false);
  const [error, setError] = useState();

  const { client } = useContext(AppContext);

  // get saved credentials
  useEffect(() => {
    const storedCredentials = JSON.parse(localStorage.getItem("vmware"));
    if (storedCredentials) setCredentials(storedCredentials);

    // window.ezdemoAPI
    //   .getCredentials("vmware")
    //   .then((c) => {
    //     if (c) {
    //       setCredentials(JSON.parse(c));
    //     }
    //   })
    //   .catch((e) => console.error(e));
  }, []);

  // useEffect(() => {
  //   if (wait) {
  //     getAnsibleResponse(output, "vconnect")
  //       .then((data) => {
  //         onSuccess({ ...credentials, ...data });
  //       })
  //       .catch((error) => {
  //         setError(error);
  //       })
  //       .finally(() => {
  //         setWait(false);
  //       });
  //   }
  // }, [credentials, onSuccess, output, setError, wait]);

  const handleSubmit = () => {
    setWait(true);
    setError(false);
    // setOutput([]);

    const vars = {
      address: credentials.address,
      username: credentials.username,
      password: credentials.password,
    };
    window.ezdemoAPI
      .queryVcenter({ request: "session", ...vars })
      .then((result) => {
        if (result.error) setError(result.error.message);
        else if (result.value.error_type) setError(result.value.error_type);
        else onSuccess({ ...vars, session: result.value });
      })
      .catch((error) => setError(error))
      .finally(() => setWait(false));
    // window.ezdemoAPI.saveCredentials({ vmware: credentials });
    localStorage.setItem("vmware", JSON.stringify(credentials));
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
      {error && <Text color="status-critical">{JSON.stringify(error)}</Text>}
    </Form>
  );
}
