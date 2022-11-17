import {
  Anchor,
  Box,
  Button,
  List,
  Menu,
  NameValueList,
  NameValuePair,
  Page,
  PageHeader,
  Paragraph,
  Spinner,
  Text,
  Tip,
} from "grommet";
import { Add, Cluster, More, Refresh } from "grommet-icons";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../ContextProviders";
import { getAnsibleResponse } from "./getAnsibleResponse";
import { Popup } from "./Popup";
import { ReverseAnchor } from "./ReverseAnchor";
import { ServerConnect } from "./ServerConnect";
import { addOrUpdate, badIcon, goodIcon, runAnsible, warnIcon } from "./Utils";

export const ListClusters = () => {
  const [clusters, setClusters] = useState([]);
  const [waitForHost, setWaitForHost] = useState(false);
  const [popup, setPopup] = useState();
  const [ansibleRunFor, setAnsibleRunFor] = useState();

  const { connection, output, setOutput, setError, learning } =
    useContext(AppContext);

  const navigate = useNavigate();

  // get saved clusters if any
  useEffect(() => {
    const clusters = JSON.parse(localStorage.getItem("clusters"));
    if (clusters) {
      setClusters(clusters);
    }
  }, []);

  // monitor output
  useEffect(() => {
    if (waitForHost && output.length > 0) {
      switch (ansibleRunFor) {
        case "dfservices":
          getAnsibleResponse(output, "dfservices")
            .then((data) => {
              const servicesStatus = data.map((s) => {
                return {
                  name: s.split(" ")[0],
                  state: s.split(" ")[1],
                };
              });

              const newClusters = clusters.map((o) =>
                o.address === waitForHost.address &&
                o.username === waitForHost.username
                  ? {
                      ...o,
                      services: servicesStatus,
                    }
                  : o
              );

              setClusters(newClusters);
              localStorage.setItem("clusters", JSON.stringify(newClusters));
            })
            .catch((error) => {
              setError((prev) => [...prev, error]);
            })
            .finally(() => {
              setWaitForHost(false);
            });

          break;

        case "dfclient":
          getAnsibleResponse(output, "dfclient")
            .then((data) => {
              if (data) {
                const updatedClusters = addOrUpdate(
                  clusters,
                  "address",
                  waitForHost.address,
                  {
                    ...waitForHost,
                    cluster_name: data[0],
                    fqdn: data[1],
                    status: "configured",
                  }
                );
                saveClusters(updatedClusters);
              }
            })
            .catch((error) => {
              setError((prev) => [...prev, error]);
            })
            .finally(() => {
              setWaitForHost(false);
            });

          break;

        case "dfrefresh":
          getAnsibleResponse(output, "dfrefresh")
            .then((data) => {
              if (data) console.dir(data); // refresh succesful
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
  }, [ansibleRunFor, clusters, output, setError, waitForHost]);

  const saveClusters = (newList) => {
    setClusters(newList);
    localStorage.setItem("clusters", JSON.stringify(newList));
  };

  const refreshClusters = () => {
    const newList = JSON.parse(localStorage.getItem("clusters"));
    setClusters(newList);
  };

  const runAnsibleFor = (play, host) => {
    host = { ...host, status: "configuring" };
    setOutput([]);
    setWaitForHost(host);
    setAnsibleRunFor(play);
    if (runAnsible(play, host)) {
      if (play === "dfclient") {
        let updatedClusters = addOrUpdate(
          clusters,
          "address",
          host.address,
          host
        );
        saveClusters(updatedClusters);
      }
    }
  };

  const removeCluster = (c) => {
    setClusters((prev) => {
      let removedList = prev.filter(
        (o) => !(o.address === c.address && o.username === c.username)
      );
      localStorage.setItem("clusters", JSON.stringify(removedList));
      return removedList;
    });
  };

  // const isClusterHealthy = (host) =>
  //   host.services &&
  //   host.services.length > 0 &&
  //   host.services.every((s) => s.state === "active");

  return (
    <Page>
      <PageHeader
        title="Clusters"
        subtitle="Use an existing clusters"
        parent={<ReverseAnchor label="Home" onClick={() => navigate(-1)} />}
        actions={
          <Box gap="small" margin="none" direction="row">
            <Button icon={<Add />} onClick={() => setPopup("clusterconnect")} />
            <Button icon={<Refresh />} onClick={() => refreshClusters()} />
          </Box>
        }
        pad={{ vertical: "medium" }}
      />

      {learning && (
        <Box>
          <Paragraph fill>
            You can use existing Data Fabric clusters by adding them to the
            list, and configuring for use cases.
          </Paragraph>
          <Paragraph fill>
            If status icon is not green, please select the menu on the right of
            the cluster you wish to use, and "Configure". This will install
            example code to use for the demo use cases, and create required
            streams, tables & folders on Data Fabric.
          </Paragraph>
          <Paragraph fill>
            Once the configuration is done, you can open the Data Fabric Cluster
            page by clicking on the cluster name.
          </Paragraph>
        </Box>
      )}
      <List
        border="horizontal"
        data={clusters}
        action={(item, index) => (
          <Box key={index} direction="row" align="between" gap="medium">
            <Box direction="row" gap="small" align="center">
              {/* {isClusterHealthy(item) ? goodIcon : badIcon}
              <Anchor
                color="text-weak"
                onClick={() => {
                  setConnection(item);
                  setPopup("clusterview");
                }}
                label="Services"
              /> */}

              {item.status === "configured" ? (
                <Tip content="Ready">{goodIcon}</Tip>
              ) : (
                <Tip content="Configuration needed!">{warnIcon}</Tip>
              )}

              <Text gap="none" color="text-weak">
                {item.status}
              </Text>
            </Box>
            <Menu
              icon={
                waitForHost?.address === item.address ? <Spinner /> : <More />
              }
              hoverIndicator
              items={[
                [
                  // {
                  //   label: "Refresh",
                  //   onClick: () => runAnsibleFor("dfrefresh", item),
                  // },
                  // {
                  //   label: "Check services",
                  //   onClick: () =>
                  //     runAnsibleFor("dfservices", { ...item, services: null }),
                  // },
                  {
                    label: "Configure",
                    onClick: () => runAnsibleFor("dfclient", item),
                  },
                ],
                [
                  {
                    label: "Remove cluster",
                    onClick: () => removeCluster(item),
                  },
                ],
              ]}
            />
          </Box>
        )}
      >
        {(datum, index) => (
          <Anchor
            weight="bold"
            key={index}
            // disabled={!isClusterHealthy(datum)}
            onClick={() => {
              navigate("/datafabric/" + datum.address);
            }}
          >
            {datum.cluster_name || datum.address}
          </Anchor>
        )}
      </List>

      {popup === "clusterconnect" && (
        <Popup
          title="Sign in"
          subtitle="Connect to Data Fabric"
          closer={setPopup}
          content={
            <ServerConnect
              onConnect={(c) => {
                setPopup(false);
                setOutput([]);
                if (c) {
                  setClusters((old) => [...old, c]);
                  localStorage.setItem(
                    "clusters",
                    JSON.stringify([...clusters, c])
                  );
                }
              }}
            />
          }
        />
      )}
      {popup === "clusterview" && (
        <Popup
          title="Cluster"
          subtitle="Service Status"
          closer={setPopup}
          icon={<Cluster />}
          content={
            <Box>
              <NameValueList
                pairProps={{ direction: "column" }}
                valueProps={{ width: ["auto", "medium"] }}
              >
                <NameValuePair name="Host">{connection?.address}</NameValuePair>
                {connection?.services?.map((srv) => {
                  return (
                    <NameValuePair name={srv.name} key={srv.name}>
                      <Box align="center" gap="xsmall" direction="row">
                        {srv.state === "active" ? goodIcon : badIcon}
                        {srv.state || "--"}
                      </Box>
                    </NameValuePair>
                  );
                })}
              </NameValueList>
            </Box>
          }
        />
      )}
    </Page>
  );
};
