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
import {
  addOrUpdate,
  badIcon,
  BrowserLink,
  goodIcon,
  mapResources,
  runAnsible,
  warnIcon,
} from "./Utils";
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
    const ansibleTaskCanInstall = () => {
      getAnsibleResponse(output, "dfcaninstall")
        .then((data) => {
          const resources = mapResources(data);
          const status =
            resources.length > 0 &&
            resources.every((s) => s.name === "swap" || s.valid)
              ? "verified"
              : "not enough resources";

          const updatedServers = addOrUpdate(
            servers,
            "address",
            waitForHost.address,
            { ...waitForHost, resources, status }
          );
          // update server list with resources
          saveUpdates(updatedServers);
        })
        .catch((error) => {
          setError((prev) => [...prev, error]);
        })
        .finally(() => {
          setWaitForHost(false);
        });
    };
    const ansibleTaskInstall = () => {
      getAnsibleResponse(output, "dfinstall")
        .then((data) => {
          if (data.length > 0) {
            // add/update cluster in the list
            const updatedClusters = addOrUpdate(
              JSON.parse(localStorage.getItem("clusters")),
              "address",
              waitForHost.address,
              { ...waitForHost, cluster_name: data[0], status: "installed" }
            );
            localStorage.setItem("clusters", JSON.stringify(updatedClusters));
            // also update the server in the list
            const updatedServers = addOrUpdate(
              servers,
              "address",
              waitForHost.address,
              {
                ...waitForHost,
                status: "installed",
              }
            );
            saveUpdates(updatedServers);
          }
        })
        .catch((error) => {
          setError((prev) => [...prev, error]);
        })
        .finally(() => {
          setWaitForHost(false);
        });
    };

    if (waitForHost && output.length > 0) {
      switch (ansibleRunFor) {
        case "dfcaninstall":
          ansibleTaskCanInstall();
          break;

        case "dfinstall":
          ansibleTaskInstall();
          break;

        default:
          break;
      }
    }
  }, [ansibleRunFor, output, servers, setError, waitForHost]);

  const runAnsibleFor = (play, host) => {
    host = { ...host, status: "installing" };
    setOutput([]);

    setWaitForHost(host);
    setAnsibleRunFor(play);

    if (runAnsible(play, host)) {
      if (play === "dfinstall") {
        const updatedServers = addOrUpdate(
          servers,
          "address",
          host.address,
          host
        );
        saveUpdates(updatedServers);
      }
    }
  };

  const saveUpdates = (newList) => {
    setServers(newList);
    localStorage.setItem("servers", JSON.stringify(newList));
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

  return (
    <Page>
      <PageHeader
        title="Servers"
        subtitle="Single-node Data Fabric installation"
        pad={{ vertical: "medium" }}
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
      />

      {/* Servers List */}
      <List
        data={servers}
        action={(item, index) => (
          <Box key={index} direction="row" align="between" gap="medium">
            <Box direction="row" gap="small" align="center">
              {item.status === "verified"
                ? goodIcon
                : item.status === "connected"
                ? warnIcon
                : badIcon}
              <BrowserLink
                label={item.status}
                url={"https://" + item.address + ":9443/"}
                disabled={
                  !(item.status === "installed" || item.status === "installing")
                }
              />
            </Box>
            <Menu
              icon={item.status === "installing" ? <Spinner /> : <More />}
              hoverIndicator
              items={[
                [
                  {
                    label: "Connect",
                    onClick: () => {
                      setConnection(item);
                      setPopup("serverconnect");
                    },
                  },
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
                      (clusterSettings?.cluster_name || "my") +
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
            <Tip content="Server details">
              <Anchor
                weight="bold"
                onClick={() => {
                  setConnection(datum);
                  setPopup("serverview");
                }}
                label={datum.displayName}
              />
            </Tip>
            <Text color="text-weak">{datum.address}</Text>
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
                const updatedServers = addOrUpdate(
                  servers,
                  "address",
                  connection.address,
                  { ...connection, status: "connected" }
                );
                setServers(updatedServers);
                localStorage.setItem("servers", JSON.stringify(updatedServers));
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
          subtitle="Installation"
          closer={setPopup}
          content={
            <Form
              validate="blur"
              value={clusterSettings}
              onChange={setClusterSettings}
              onSubmit={({ value }) => {
                runAnsibleFor("dfinstall", {
                  ...connection,
                  my_cluster_name: value.cluster_name || "my",
                  my_admin_password: value.admin_password || "mapr",
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
