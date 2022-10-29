import { Button, Form, FormField, Spinner, TextInput } from "grommet";
import { useEffect, useState } from "react";
import { configureClient } from "./ec2Client";

export function AwsLogin({ onSuccess }) {
  const [credentials, setCredentials] = useState({
    accessKeyId: "",
    secretAccessKey: "",
    region: "",
  });
  const [wait, setWait] = useState(false);

  // get saved credentials
  useEffect(() => {
    window.ezdemoAPI
      .getCredentials("aws")
      .then((c) => {
        if (c) {
          setCredentials(JSON.parse(c));
        }
      })
      .catch((e) => console.error(e));
  }, []);

  const handleSubmit = () => {
    setWait(true);
    configureClient(
      credentials.accessKeyId,
      credentials.secretAccessKey,
      credentials.region
    )
      .then((client) => {
        if (client) {
          onSuccess(client);
          // setClient((old) => {
          //   return { ...old, aws: client };
          // });
          window.ezdemoAPI.saveCredentials({ aws: credentials });
          setWait(false);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <Form
      value={credentials}
      onChange={setCredentials}
      onSubmit={handleSubmit}
      validate="submit"
      direction="row"
    >
      <FormField
        name="accessKeyId"
        htmlFor="accessKeyId"
        label="Access Key"
        required
        margin="small"
      >
        <TextInput id="accessKeyId" name="accessKeyId" />
      </FormField>
      <FormField
        name="secretAccessKey"
        htmlFor="secretAccessKey"
        label="Secret Access Key"
        required
        margin="small"
      >
        <TextInput
          id="secretAccessKey"
          name="secretAccessKey"
          type="password"
        />
      </FormField>
      <FormField
        name="region"
        htmlFor="region"
        label="Region"
        required
        margin="small"
      >
        <TextInput id="region" name="region" />
      </FormField>
      <Button
        margin="small"
        label={wait ? "Signing in..." : "Sign In"}
        icon={wait ? <Spinner /> : <></>}
        reverse
        primary
        disabled={wait}
        type="submit"
      />
    </Form>
  );
}
