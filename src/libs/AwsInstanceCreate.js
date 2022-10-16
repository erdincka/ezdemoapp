import {
  Box,
  Button,
  Form,
  FormField,
  Select,
  Spinner,
  TextInput,
} from "grommet";
import { useContext, useEffect, useState } from "react";
import { AppContext, AwsContext } from "../ContextProviders";
import {
  createInstance,
  getAMIs,
  getKeyPairs,
  getSecurityGroups,
  waitForInstanceOk,
} from "./ec2Client";
import { WizardContext } from "./Wizard";

export function AwsInstanceCreate() {
  const [value, setValue] = useState({
    ami: {},
    name: "",
    keypair: {},
    securitygroup: {},
  });
  const [ready, setReady] = useState(true);
  const [images, setImages] = useState();
  const [keypairs, setKeyPairs] = useState();
  const [securitygroups, setSecurityGroups] = useState();

  const { setValid } = useContext(WizardContext);
  const { client } = useContext(AwsContext);
  const { setConnection } = useContext(AppContext);

  useEffect(() => {
    const queryAsync = async () => {
      if (client) {
        setImages(await getAMIs(client));
        setKeyPairs(await getKeyPairs(client));
        setSecurityGroups(await getSecurityGroups(client));
      }
    };
    queryAsync();
  }, [client]);

  const onSubmit = async (data) => {
    setReady(false);
    const newInstance = await createInstance(client, data);
    const instance = await waitForInstanceOk(client, newInstance);
    if (instance.PublicIpAddress) {
      setConnection({
        address: instance.PublicIpAddress,
        username:
          instance.PlatformDetails === "Linux/UNIX" ? "ubuntu" : "ec2-user",
        privatekey: null,
        instance,
      });
    }
    setReady(true);
    setValid(true);
  };

  return (
    <Form
      value={value}
      onChange={setValue}
      onSubmit={(event) => onSubmit(event.value)}
      validate="blur"
    >
      <FormField
        name="ami"
        htmlFor="ami"
        label="Image / OS"
        required
        margin="small"
        width="medium"
      >
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
        width="medium"
      >
        <TextInput id="name" name="name" />
      </FormField>
      <FormField
        name="keypair"
        htmlFor="keypair"
        label="KeyPair"
        required
        margin="small"
        width="medium"
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
        width="medium"
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
          label={ready ? "Create" : "Wait for Instance..."}
          icon={ready ? <></> : <Spinner />}
          disabled={!client || !ready}
        />
      </Box>
    </Form>
  );
}

export default AwsInstanceCreate;
