import { Box, Button, Form, FormField, TextInput } from "grommet";
import { useEffect, useState } from "react";
import { configureClient } from "./ec2Client";

function AWSCredentials(props) {
  const [value, setValue] = useState({
    accessKeyId: "",
    secretAccessKey: "",
    region: "",
  });

  useEffect(() => {
    window.ezdemoAPI
      .getCredentials("aws")
      .then((c) => {
        if (c) {
          setValue(JSON.parse(c));
        }
      })
      .catch((e) => console.error(e));
  }, []);

  const saveCredentials = () => {
    const credentials = { aws: value };
    const ec2client = configureClient(
      value.accessKeyId,
      value.secretAccessKey,
      value.region
    );
    props.save(credentials, ec2client);
  };

  return (
    <Form
      value={value}
      onChange={(nextValue) => setValue(nextValue)}
      onSubmit={(data) => {
        saveCredentials();
      }}
      validate="blur"
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
        <TextInput id="secretAccessKey" name="secretAccessKey" />
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
      <Box direction="row" gap="medium">
        <Button type="submit" primary label="Save" />
      </Box>
    </Form>
  );
}

export default AWSCredentials;
