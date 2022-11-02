import { Box, Button, List, Text } from "grommet";
import { Lock, Redhat, Refresh, Server, Ubuntu } from "grommet-icons";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../ContextProviders";
import { Popup } from "../Popup";
import { ServerConnect } from "../ServerConnect";
import { AwsInstanceCreate } from "./AwsInstanceCreate";
import { getInstances, getInstanceName } from "./ec2Client";

export function AwsInstanceSelect({ client, setServers }) {
  const [instances, setInstances] = useState([]);
  const [popup, setPopup] = useState(false);

  const { connection, setConnection } = useContext(AppContext);

  useEffect(() => {
    const queryAsync = async () => {
      if (client) setInstances(await getInstances(client));
    };
    queryAsync();
  }, [client]);

  const instance_user = (i) =>
    i.PlatformDetails === "Linux/UNIX" ? "ubuntu" : "ec2-user";

  const instance_icon = (i) =>
    i.PlatformDetails === "Linux/UNIX" ? (
      <Ubuntu size="medium" color="plain" />
    ) : (
      <Redhat size="medium" color="plain" />
    );

  return (
    <>
      <Box direction="row" align="center">
        <Text weight="bold">Instances on {client.config.region}</Text>
        {client && (
          <Button
            icon={<Refresh />}
            onClick={async () => setInstances(await getInstances(client))}
          />
        )}
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
                    displayName: getInstanceName(item)[0],
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
      <Button
        margin={{ vertical: "medium" }}
        secondary
        label="New Instance"
        alignSelf="start"
        onClick={() => setPopup("newinstance")}
      />

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
                  setServers((prev) => {
                    return [
                      ...prev,
                      {
                        ...c,
                        displayName: connection.displayName,
                        connected: true,
                      },
                    ];
                  });
                }
              }}
            />
          }
        />
      )}
    </>
  );
}
