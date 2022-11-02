import {
  Anchor,
  Box,
  Button,
  Form,
  FormField,
  List,
  Menu,
  NameValueList,
  NameValuePair,
  Page,
  PageHeader,
  Spinner,
  Text,
  TextInput,
  Tip,
} from "grommet";
import { More, MoreVertical, Server } from "grommet-icons";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../ContextProviders";
import { AwsInstanceSelect } from "./AWS/AwsInstanceSelect";
import { AwsLogin } from "./AWS/AwsLogin";
import { getAnsibleResponse } from "./getAnsibleResponse";
import { Popup } from "./Popup";
import { ServerConnect } from "./ServerConnect";
import { badIcon, goodIcon, mapResources, runAnsible } from "./Utils";
import { Vcenter } from "./Vmware/Vcenter";
import { VmwareLogin } from "./Vmware/VmwareLogin";

export const ListServers = () => {
  const [servers, setServers] = useState([]);
  const [waitForHost, setWaitForHost] = useState(false);
  const [popup, setPopup] = useState();
  const [ansibleRunFor, setAnsibleRunFor] = useState();
  const [clusterSettings, setClusterSettings] = useState({
    cluster_name: "",
    admin_password: "",
  });

  const {
    connection,
    setConnection,
    client,
    setClient,
    output,
    setOutput,
    setError,
  } = useContext(AppContext);

  useEffect(() => {
    const servers = JSON.parse(localStorage.getItem("servers"));
    if (servers) {
      setServers(servers);
    }
  }, []);

  useEffect(() => {
    if (waitForHost && output.length > 0) {
      switch (ansibleRunFor) {
        case "dfcaninstall":
          getAnsibleResponse(output, "dfcaninstall")
            .then((data) => {
              let resources = mapResources(data);
              // update server list with resources
              setServers((prev) =>
                prev.map((o) =>
                  o.address === waitForHost.address &&
                  o.username === waitForHost.username
                    ? {
                        ...waitForHost,
                        resources,
                      }
                    : o
                )
              );
              localStorage.setItem("servers", JSON.stringify(servers));
            })
            .catch((error) => {
              setError((prev) => [...prev, error]);
            })
            .finally(() => {
              setWaitForHost(false);
            });

          break;

        case "dfinstall":
          getAnsibleResponse(output, "dfinstall")
            .then((data) => {
              console.dir(data);
              if (data[0] === waitForHost.address) {
                // TODO: update clusters list with newly installed cluster
              }
            })
            .catch((error) => {
              setError((prev) => [...prev, error]);
            })
            .finally(() => {
              setWaitForHost(false);
            });

          break;

        default:
          break;
      }
    }
  }, [ansibleRunFor, output, servers, setError, waitForHost]);

  const runAnsibleFor = (play, host) => {
    setOutput([]);
    setWaitForHost(host);
    setAnsibleRunFor(play);
    runAnsible(play, host);
  };

  const removeServer = (c) => {
    setServers((prev) => {
      let removedList = prev.filter(
        (o) => !(o.address === c.address && o.username === c.username)
      );
      localStorage.setItem("servers", JSON.stringify(removedList));
      return removedList;
    });
  };

  const hasEnoughResources = (host) =>
    host.resources?.length > 0 &&
    host.resources.every((s) => s.name === "swap" || s.valid);

  return (
    <Page>
      <PageHeader
        title="Servers"
        actions={
          <Menu
            icon={<MoreVertical />}
            items={[
              { label: "On AWS", onClick: () => setPopup("aws") },
              { label: "On VMWare", onClick: () => setPopup("vmware") },
              {
                label: "Use existing",
                onClick: () => setPopup("serverconnect"),
              },
            ]}
            width="medium"
          />
        }
        pad={{ vertical: "medium" }}
      />
      {/* Servers List */}
      <List
        data={servers}
        action={(item, index) => (
          <Box key={index} direction="row" align="between" gap="medium">
            <Box direction="row" gap="small" align="center">
              {waitForHost && waitForHost.address === item.address ? (
                <Spinner />
              ) : !item.connected ? (
                <Tip content="Click on IP to connect">{badIcon}</Tip>
              ) : hasEnoughResources(item) ? (
                goodIcon
              ) : (
                badIcon
              )}
              <Anchor
                color="text-weak"
                onClick={() => {
                  setConnection(item);
                  setPopup("serverview");
                }}
              >
                {waitForHost &&
                waitForHost.address === item.address &&
                ansibleRunFor === "dfinstall"
                  ? "Installing..."
                  : item.connected
                  ? item.resources
                    ? "Checked"
                    : "Not checked"
                  : "Not connected"}
              </Anchor>
            </Box>
            <Menu
              icon={<More />}
              hoverIndicator
              items={[
                [
                  {
                    label: "Check resources",
                    onClick: () =>
                      runAnsibleFor("dfcaninstall", {
                        ...item,
                        resources: null,
                      }),
                  },
                  {
                    label:
                      "Install " +
                      (clusterSettings?.cluster_name || "core") +
                      ".df.demo",
                    onClick: () => {
                      setConnection(item);
                      setPopup("dfinstall");
                    },
                  },
                ],
                [
                  {
                    label: "Remove server",
                    onClick: () => removeServer(item),
                  },
                ],
              ]}
            />
          </Box>
        )}
      >
        {(datum, index) => (
          <Box direction="row" key={index} align="center" gap="small">
            <Text color="text-weak">{datum.displayName}</Text>
            <Anchor
              weight="bold"
              onClick={() => {
                setConnection(datum);
                setPopup("serverconnect");
              }}
            >
              {datum.address}
            </Anchor>
          </Box>
        )}
      </List>

      {client?.aws && (
        <AwsInstanceSelect client={client.aws} setServers={setServers} />
      )}

      {client?.vmware && (
        <Vcenter client={client.vmware} setServers={setServers} />
      )}

      {popup === "serverconnect" && (
        <Popup
          title="Connect"
          subtitle="Ubuntu 20.04 or RHEL 8.x"
          closer={setPopup}
          content={
            <ServerConnect
              host={connection.address || undefined}
              user={connection.username || undefined}
              onConnect={(c) => {
                setPopup(false);
                setOutput([]);
                if (c) setServers((old) => [...old, c]);
              }}
            />
          }
        />
      )}
      {popup === "serverview" && (
        <Popup
          title="Server"
          subtitle="Status"
          closer={setPopup}
          icon={<Server />}
          content={
            <Box>
              <NameValueList
                pairProps={{ direction: "column" }}
                valueProps={{ width: ["auto", "medium"] }}
              >
                <NameValuePair name="Host">{connection.address}</NameValuePair>
                {connection?.resources?.map((res) => {
                  return (
                    <NameValuePair name={res.name} key={res.name}>
                      <Box align="center" gap="xsmall" direction="row">
                        {res.valid ? goodIcon : badIcon}
                        {res.state || "--"}
                      </Box>
                    </NameValuePair>
                  );
                })}
              </NameValueList>
            </Box>
          }
        />
      )}
      {popup === "dfinstall" && (
        <Popup
          title="Confirm"
          subtitle="Please confirm installation (30+ minutes)"
          closer={setPopup}
          content={
            <Form
              validate="blur"
              value={clusterSettings}
              onChange={setClusterSettings}
              onSubmit={({ value }) => {
                runAnsibleFor("dfinstall", {
                  ...connection,
                  my_cluster_name: value.cluster_name || "core",
                  admin_password: value.admin_password || "mapr",
                });
                setPopup(false);
              }}
              method="post"
            >
              <Box gap="medium">
                <Text>Cluster will be created with these settings:</Text>
                <FormField
                  label="Cluster Name"
                  htmlFor="cluster_name"
                  name="cluster_name"
                >
                  <TextInput
                    id="cluster_name"
                    name="cluster_name"
                    type="text"
                    placeholder="<name>.df.demo"
                  />
                </FormField>
                <FormField
                  label="Cluster Admin Password"
                  htmlFor="admin_password"
                  name="admin_password"
                >
                  <TextInput
                    id="admin_password"
                    name="admin_password"
                    type="password"
                    placeholder="Cluster admin password"
                  />
                </FormField>
                <Button label="Start Install" primary type="submit" />
              </Box>
            </Form>
          }
        />
      )}
      {popup === "aws" && (
        <Popup
          title="Sign in"
          subtitle="Connect to Amazon Web Services"
          closer={setPopup}
          content={
            <AwsLogin
              onSuccess={(res) => {
                setPopup(false);
                if (res)
                  setClient((prev) => {
                    return { ...prev, aws: res };
                  });
              }}
            />
          }
        />
      )}
      {popup === "vmware" && (
        <Popup
          title="Sign in"
          subtitle="Connect to vCenter"
          closer={setPopup}
          content={
            <VmwareLogin
              onSuccess={(res) => {
                setPopup(false);
                if (res)
                  setClient((prev) => {
                    return { ...prev, vmware: res };
                  });
              }}
            />
          }
        />
      )}
    </Page>
  );
};
