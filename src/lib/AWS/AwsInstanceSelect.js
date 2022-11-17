import { Box, Button, List, Text } from "grommet";
import { Add, Lock, Refresh, Server } from "grommet-icons";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../ContextProviders";
import { Popup } from "../Popup";
import { ServerConnect } from "../ServerConnect";
import { addOrUpdate, BrowserLink } from "../Utils";
import { AwsInstanceCreate } from "./AwsInstanceCreate";
import {
  getInstances,
  getInstanceName,
  instance_user,
  instance_icon,
} from "./ec2Client";

export function AwsInstanceSelect({ client, servers, setServers }) {
  const [instances, setInstances] = useState([]);
  const [popup, setPopup] = useState(false);

  const { connection, setConnection } = useContext(AppContext);

  useEffect(() => {
    const queryAsync = async () => {
      if (client) setInstances(await getInstances(client));
    };
    queryAsync();
  }, [client]);

  return (
    <>
      <Box direction="row" align="center" justify="between">
        <Text weight="bold">
          Eligible instances on{" "}
          <BrowserLink
            label={client.config.region}
            url={`https://${client.config.region}.console.aws.amazon.com/ec2/home?region=${client.config.region}#Instances:v=3`}
          />
        </Text>
        <Box direction="row">
          <Button
            margin={{ vertical: "medium" }}
            icon={<Refresh />}
            alignSelf="start"
            onClick={async () => setInstances(await getInstances(client))}
          />
          <Button
            margin={{ vertical: "medium" }}
            icon={<Add />}
            alignSelf="start"
            onClick={() => setPopup("newinstance")}
          />
        </Box>
      </Box>
      {instances && (
        <List
          data={instances}
          action={(item, index) => (
            <Box key={index} direction="row" align="between" gap="medium">
              <Button
                secondary
                label="Select"
                onClick={() => {
                  setConnection({
                    address: item.PublicIpAddress,
                    username: instance_user(item),
                    displayName: getInstanceName(item),
                  });
                  setPopup("serverconnect");
                }}
              />
            </Box>
          )}
        >
          {(datum, index) => (
            <Box key={index} direction="row" gap="small">
              <Box alignSelf="center">{instance_icon(datum)}</Box>
              {getInstanceName(datum)}
              {datum.PublicIpAddress}
            </Box>
          )}
        </List>
      )}

      {popup === "newinstance" && (
        <Popup
          title="Create"
          subtitle="New EC2 Instance"
          icon={<Server />}
          closer={setPopup}
          content={
            <AwsInstanceCreate
              client={client}
              onSuccess={(res) => {
                setInstances((prev) => {
                  return [...(prev || []), res];
                });
                setPopup(false);
              }}
            />
          }
        />
      )}

      {popup === "serverconnect" && (
        <Popup
          title="Connect to"
          subtitle={"Instance: " + connection.address}
          icon={<Lock />}
          closer={setPopup}
          content={
            <ServerConnect
              host={connection.address}
              user={connection.username}
              onConnect={(c) => {
                if (c) {
                  setPopup(false);
                  const updatedServers = addOrUpdate(
                    servers,
                    "address",
                    connection.address,
                    {
                      ...connection,
                      displayName: connection.displayName,
                      status: "connected",
                    }
                  );
                  setServers(updatedServers);
                  localStorage.setItem(
                    "servers",
                    JSON.stringify(updatedServers)
                  );
                }
              }}
            />
          }
        />
      )}
    </>
  );
}
