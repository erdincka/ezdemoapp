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
import { Cluster, FormAdd, More } from "grommet-icons";
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
    if (waitForHost && output.length > 0) {
      if (ansibleRunFor === "dfservices") {
        getAnsibleResponse(output, "dfservices")
          .then((data) => {
            let servicesStatus = data.map((s) => {
              return { name: s.split(" ")[0], state: s.split(" ")[1] };
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
            setWaitForHost(false);
          })
          .catch((error) => {
            setError((prev) => [...prev, error]);
            setWaitForHost(false);
          });
      }
    }
  }, [ansibleRunFor, clusters, output, setError, waitForHost]);

  const runAnsibleFor = (play, host) => {
    setOutput([]);
    setWaitForHost(host);
    setAnsibleRunFor(play);
    runAnsible(play, { address: host.address, username: host.username }); // just send needed vars to ansible
  };

  const removeCluster = (c) => {
    setClusters((prev) =>
      prev.filter(
        (o) => !(o.address === c.address && o.username === c.username)
      )
    );
  };

  return (
    <Page>
      <PageHeader
        title="Clusters"
        parent={<ReverseAnchor label="Home" onClick={() => navigate(-1)} />}
        actions={
          <Button
            icon={<FormAdd />}
            secondary
            onClick={() => setPopup("clusterconnect")}
          />
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
              ) : item.services?.length > 0 &&
                item.services.every((s) => s.state === "active") ? (
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
