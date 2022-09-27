import { Box, Text, Select, FormField } from "grommet";
import { useEffect, useState } from "react";
import { getInstances } from "./ec2Client";

function AwsInstanceSelect(props) {
  const [instances, setInstances] = useState();
  const [value, setValue] = useState();
  const { client, instance, callback } = props;

  useEffect(() => {
    const queryAsync = async () => {
      if (client) setInstances(await getInstances(client));
    };
    queryAsync();
  }, [client]);

  const onSelect = (data) => {
    setValue(data);
    callback(data);
  };

  return (
    <Box margin="medium">
      {!(instances || instance) && (
        <Text>No eligible instance to use, create new one</Text>
      )}
      {instances && (
        <FormField
          name="instance"
          htmlFor="instance"
          label="Select Instance"
          required
          margin="small"
        >
          <Select
            id="instance"
            name="instance"
            options={instances || []}
            clear
            onChange={({ value }) => {
              onSelect(value);
            }}
            value={value}
            labelKey="InstanceId"
            valueKey="InstanceId"
          />
        </FormField>
      )}
    </Box>
  );
}

export default AwsInstanceSelect;
