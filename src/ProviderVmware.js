import { Box, Button } from "grommet";

function ProviderVmware(props) {
  const {
    // client,
    setClient,
    // instance,
    // setInstance,
    credentials,
    setCredentials,
  } = props;

  const saveCredentials = (data, client) => {
    window.ezdemoAPI.saveCredentials(data);
    setCredentials({ ...credentials, ...data });
    setClient(client);
  };

  return (
    <Box>
      <Button onClick={() => saveCredentials({ vmware: {} }, null)}>
        Vmware login
      </Button>{" "}
    </Box>
  );
}

export default ProviderVmware;
