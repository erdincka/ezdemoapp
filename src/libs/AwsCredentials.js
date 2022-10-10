import { Form, FormField, TextInput } from "grommet";
import { useContext, useEffect, useState } from "react";
import { ClientContext } from "../ContextProviders";
import { configureClient } from "./ec2Client";
import { WizardContext } from "./Wizard";

export function AWSCredentials() {
  const nullCredentials = {
    accessKeyId: "",
    secretAccessKey: "",
    region: "",
  };

  const [credentials, setCredentials] = useState(nullCredentials);
  const { setClient } = useContext(ClientContext);
  const { setValid } = useContext(WizardContext);

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

  useEffect(() => {
    configureClient(
      credentials.accessKeyId,
      credentials.secretAccessKey,
      credentials.region
    )
      .then((res) => {
        setClient(res);
        if (res) setValid(true);
        else setValid(false);
      })
      .catch((error) => console.error(error));
  }, [setClient, credentials, setValid]);

  return (
    <Form
      value={credentials}
      onChange={setCredentials}
      onSubmit={({ value }) => window.ezdemoAPI.saveCredentials(value)}
      onReset={() => setCredentials(nullCredentials)}
      validate="blur"
      direction="row"
    >
      <FormField
        name="accessKeyId"
        htmlFor="accessKeyId"
        label="Access Key"
        required
        width="medium"
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
    </Form>
  );
}

export default AWSCredentials;
