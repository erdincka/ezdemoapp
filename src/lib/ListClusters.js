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
  Spinner,
} from "grommet";
import { Add, Cluster, More } from "grommet-icons";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../ContextProviders";
import { getAnsibleResponse } from "./getAnsibleResponse";
import { Popup } from "./Popup";
import { ReverseAnchor } from "./ReverseAnchor";
import { ServerConnect } from "./ServerConnect";
import { badIcon, goodIcon, runAnsible } from "./Utils";

export const ListClusters = () => {
  const [clusters, setClusters] = useState([]);
  const [waitForHost, setWaitForHost] = useState(false);
  const [popup, setPopup] = useState();
  const [ansibleRunFor, setAnsibleRunFor] = useState();

  const { connection, setConnection, output, setOutput, setError } =
    useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    const clusters = JSON.parse(localStorage.getItem("clusters"));
    if (clusters) {
      setClusters(clusters);
    }
  }, []);

  useEffect(() => {
    if (waitForHost && output.length > 0) {
      switch (ansibleRunFor) {
        case "dfservices":
          getAnsibleResponse(output, "dfservices")
            .then((data) => {
              let servicesStatus = data.map((s) => {
                return {
                  name: s.split(" ")[0],
                  state: s.split(" ")[1],
                };
              });

              setClusters((prev) =>
                prev.map((o) =>
                  o.address === waitForHost.address &&
                  o.username === waitForHost.username
                    ? {
                        ...waitForHost,
                        services: servicesStatus,
                      }
                    : o
                )
              );
              localStorage.setItem("clusters", JSON.stringify(clusters));
              setWaitForHost(false);
            })
            .catch((error) => {
              setError((prev) => [...prev, error]);
              setWaitForHost(false);
            });

          break;

        case "dfclient":
          getAnsibleResponse(output, "dfclient")
            .then((data) => {
              if (data) {
                setClusters((prev) =>
                  prev.map((o) =>
                    o.address === waitForHost.address &&
                    o.username === waitForHost.username
                      ? {
                          ...waitForHost,
                          services: [
                            { name: "dummy service", state: "active" },
                          ],
                        }
                      : o
                  )
                );
              }
              setWaitForHost(false);
            })
            .catch((error) => {
              setError((prev) => [...prev, error]);
              setWaitForHost(false);
            });

          break;

        default:
          break;
      }
    }
  }, [ansibleRunFor, clusters, output, setError, waitForHost]);

  const runAnsibleFor = (play, host) => {
    setOutput([]);
    setWaitForHost(host);
    setAnsibleRunFor(play);
    runAnsible(play, host);
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

  const isClusterHealthy = (host) =>
    host.services &&
    host.services.length > 0 &&
    host.services.every((s) => s.state === "active");
  return (
    <Page>
      <PageHeader
        title="Clusters"
        parent={<ReverseAnchor label="Home" onClick={() => navigate(-1)} />}
        actions={
          <Button icon={<Add />} onClick={() => setPopup("clusterconnect")} />
        }
        pad={{ vertical: "medium" }}
      />

      <List
        border="horizontal"
        data={clusters}
        action={(item, index) => (
          <Box key={index} direction="row" align="between" gap="medium">
            <Box direction="row" gap="small" align="center">
              {waitForHost?.address === item.address ? (
                <Spinner />
              ) : isClusterHealthy(item) ? (
                goodIcon
              ) : (
                badIcon
              )}
              <Anchor
                color="text-weak"
                onClick={() => {
                  setConnection(item);
                  setPopup("clusterview");
                }}
              >
                {item?.services ? "Checked" : "Not checked"}
              </Anchor>
            </Box>
            <Menu
              icon={<More />}
              hoverIndicator
              items={[
                [
                  {
                    label: "Check services",
                    onClick: () =>
                      runAnsibleFor("dfservices", { ...item, services: null }),
                  },
                  {
                    label: "Configure client",
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
            {datum.address}
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
                if (c) setClusters((old) => [...old, c]);
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
