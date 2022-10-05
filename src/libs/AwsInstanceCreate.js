import {
  Box,
  Button,
  Form,
  FormField,
  Select,
  Spinner,
  TextInput,
  Tip,
} from "grommet";
import { useEffect, useState } from "react";
import {
  createInstance,
  getAMIs,
  getKeyPairs,
  getSecurityGroups,
  waitForInstanceOk,
} from "./ec2Client";

export function AwsInstanceCreate(props) {
  const [value, setValue] = useState({
    ami: {},
    name: "",
    keypair: {},
    securitygroup: {},
  });
  const [spinner, setSpinner] = useState(false);
  const [images, setImages] = useState();
  const [keypairs, setKeyPairs] = useState();
  const [securitygroups, setSecurityGroups] = useState();
  const { client, setInstance } = props;

  useEffect(() => {
    const queryAsync = async () => {
      if (client) setImages(await getAMIs(client));
      if (client) setKeyPairs(await getKeyPairs(client));
      if (client) setSecurityGroups(await getSecurityGroups(client));
    };
    queryAsync();
  }, [client]);

  const onSubmit = async (data) => {
    setSpinner(true);
    const instance = await createInstance(client, data);
    const waitInstance = await waitForInstanceOk(client, instance);
    setInstance(waitInstance);
    setSpinner(false);
  };

  return (
    <Form
      value={value}
      onChange={setValue}
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
          valueKey="GroupId"
          labelKey={(sg) =>
            sg.GroupName + " (" + sg.GroupId + "): " + sg.Description
          }
        />
      </FormField>
      <Box direction="row" gap="medium">
        <Button
          type="submit"
          primary
          label={spinner ? "Wait for Instance" : "Create"}
          disabled={!client || spinner}
        />
        {spinner && (
          <Tip content="Wait while instance becomes ready">
            <Spinner color="brand" message="Wait for Instance" />
          </Tip>
        )}
      </Box>
    </Form>
  );
}

export default AwsInstanceCreate;
