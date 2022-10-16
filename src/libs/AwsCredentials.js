import { Form, FormField, TextInput } from "grommet";
import { useContext, useEffect, useState } from "react";
import { AwsContext } from "../ContextProviders";
import { configureClient } from "./ec2Client";
import { WizardContext } from "./Wizard";

export function AWSCredentials() {
  const [credentials, setCredentials] = useState({
    accessKeyId: "",
    secretAccessKey: "",
    region: "",
  });
  const { setClient } = useContext(AwsContext);
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
      .then((client) => {
        if (client) {
          setClient(client);
          window.ezdemoAPI.saveCredentials({ aws: credentials });
          setValid(true);
        }
      })
      .catch((error) => console.error(error));
  }, [credentials, setClient, setValid]);

  return (
    <Form
      value={credentials}
      onChange={setCredentials}
      validate="submit"
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
