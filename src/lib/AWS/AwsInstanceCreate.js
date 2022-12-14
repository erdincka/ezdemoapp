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
import { AppContext } from "../../ContextProviders";
import {
  createInstance,
  getAMIs,
  getKeyPairs,
  getSecurityGroups,
  instance_user,
  waitForInstanceOk,
} from "./ec2Client";

export function AwsInstanceCreate({ client, onSuccess }) {
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

  const { setConnection } = useContext(AppContext);

  useEffect(() => {
    const queryAsync = async () => {
      if (client) {
        let amis = await getAMIs(client);
        setImages(amis);
        setKeyPairs(await getKeyPairs(client));
        setSecurityGroups(await getSecurityGroups(client));
      }
    };
    queryAsync();
  }, [client]);

  const onSubmit = async (data) => {
    const imageSettings = { ...value, ami: images[0] };
    // const imageSettings = value; // used when ami is selectable in the form
    // console.dir(imageSettings);

    setReady(false);
    const newInstance = await createInstance(client, imageSettings);
    const instance = await waitForInstanceOk(client, newInstance);
    if (instance.PublicIpAddress) {
      setConnection({
        address: instance.PublicIpAddress,
        username: instance_user(instance),
        privatekey: null,
        instance,
      });
      onSuccess(instance);
    }
    setReady(true);
  };

  return (
    <Form
      value={value}
      onChange={setValue}
      onSubmit={(event) => onSubmit(event.value)}
      validate="blur"
    >
      {/* <FormField
        name="ami"
        htmlFor="ami"
        label="Simple / Full"
        required
        margin="small"
      >
        <Select
          id="ami"
          name="ami"
          options={images || []}
          valueKey="ImageId"
          labelKey={(ami) => (ami.Name.includes("ubuntu") ? "Full" : "Simple")}
          defaultValue={images ? images[0] : ""}
        />
      </FormField> */}
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
          label={ready ? "Create" : "Wait for Instance..."}
          icon={ready ? <></> : <Spinner />}
          disabled={!client || !ready}
        />
      </Box>
    </Form>
  );
}
