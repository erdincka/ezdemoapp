import { Box } from "grommet";

import AWSCredentials from "./libs/AwsCredentials";
import AwsInstanceCreate from "./libs/AwsInstanceCreate";
import AwsInstanceSelect from "./libs/AwsInstanceSelect";

function ProviderAws(props) {
  const {
    client,
    setClient,
    instance,
    setInstance,
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
      {credentials.hasOwnProperty("aws") || (
        <AWSCredentials
          save={(data, client) => saveCredentials(data, client)}
        />
      )}

      {client && (
        <AwsInstanceSelect
          client={client}
          instance={instance}
          callback={setInstance}
        />
      )}
      {client && !instance && (
        <AwsInstanceCreate
          client={client}
          credentials={credentials}
          callback={setInstance}
        />
      )}
    </Box>
  );
}

export default ProviderAws;
