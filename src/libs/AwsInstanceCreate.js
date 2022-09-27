import { Box, Button, Form, FormField, Select, TextInput } from "grommet";
import { useEffect, useState } from "react";
import {
  createInstance,
  getAMIs,
  getKeyPairs,
  getSecurityGroups,
} from "./ec2Client";

function AwsInstanceCreate(props) {
  const [value, setValue] = useState({ ami: {}, name: "", keypair: {} });
  const [images, setImages] = useState();
  const [keypairs, setKeyPairs] = useState();
  const [securitygroups, setSecurityGroups] = useState();
  const { client, callback } = props;

  useEffect(() => {
    const queryAsync = async () => {
      if (client) setImages(await getAMIs(client));
      if (client) setKeyPairs(await getKeyPairs(client));
      if (client) setSecurityGroups(await getSecurityGroups(client));
    };
    queryAsync();
  }, [client]);

  const onSubmit = async (data) => {
    const instance = await createInstance(client, data);
    callback(instance);
  };

  return (
    <Form
      value={value}
      onChange={(nextValue) => setValue(nextValue)}
      onSubmit={(event) => onSubmit(event.value)}
      validate="blur"
    >
      <FormField name="ami" htmlFor="ami" label="AMI" required margin="small">
        <Select
          id="ami"
          name="ami"
          options={images || []}
          valueKey="ImageId"
          labelKey="Name"
        />
      </FormField>
      <FormField
        name="name"
        htmlFor="name"
        label="Instance Name"
        required
        margin="small"
      >
        <TextInput id="name" name="name" />
      </FormField>
      <FormField
        name="keypair"
        htmlFor="keypair"
        label="KeyPair"
        required
        margin="small"
      >
        <Select
          id="keypair"
          name="keypair"
          options={keypairs || []}
          valueKey="KeyName"
          labelKey="KeyName"
        />
      </FormField>
      <FormField
        name="securitygroup"
        htmlFor="securitygroup"
        label="Security Group"
        required
        margin="small"
      >
        <Select
          id="securitygroup"
          name="securitygroup"
          options={securitygroups || []}
          valueKey="GroupName"
          labelKey="GroupName"
        />
      </FormField>
      <Box direction="row" gap="medium">
        <Button type="submit" primary label="Create" disabled={!client} />
      </Box>
    </Form>
  );
}

export default AwsInstanceCreate;
