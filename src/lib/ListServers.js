import {
  Anchor,
  Box,
  List,
  Menu,
  NameValueList,
  NameValuePair,
  Page,
  PageHeader,
  Spinner,
} from "grommet";
import { More, MoreVertical, Server } from "grommet-icons";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../ContextProviders";
import { AwsLogin } from "./AWS/AwsLogin";
import { getAnsibleResponse } from "./getAnsibleResponse";
import { Popup } from "./Popup";
import { ServerConnect } from "./ServerConnect";
import { badIcon, goodIcon, mapResources, runAnsible } from "./Utils";
import { VmwareLogin } from "./Vmware/VmwareLogin";

export const ListServers = () => {
  const [servers, setServers] = useState([]);
  const [waitForHost, setWaitForHost] = useState(false);
  const [popup, setPopup] = useState();
  const [ansibleRunFor, setAnsibleRunFor] = useState();

  const { connection, setConnection, setClient, output, setOutput, setError } =
    useContext(AppContext);

  useEffect(() => {
    if (waitForHost && output.length > 0) {
      if (ansibleRunFor === "dfcaninstall") {
        getAnsibleResponse(output, "dfcaninstall")
          .then((data) => {
            let resources = mapResources(data);

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
            setWaitForHost(false);
          })
          .catch((error) => {
            setError((prev) => [...prev, error]);
            setWaitForHost(false);
          });
      }
    }
  }, [ansibleRunFor, output, setError, waitForHost]);

  const runAnsibleFor = (play, host) => {
    setOutput([]);
    setWaitForHost(host);
    setAnsibleRunFor(play);
    runAnsible(play, { address: host.address, username: host.username });
  };

  const removeServer = (c) => {
    setServers((prev) =>
      prev.filter(
        (o) => !(o.address === c.address && o.username === c.username)
      )
    );
  };

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
              {waitForHost?.address === item.address ? (
                <Spinner />
              ) : item.resources?.length > 0 &&
                item.resources.every((s) => s.valid) ? (
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
                {item?.resources ? "Checked" : "Not checked"}
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
          <Anchor
            weight="bold"
            key={index}
            onClick={() => {
              console.dir(datum);
            }}
          >
            {datum.address}
          </Anchor>
        )}
      </List>
      {popup === "serverconnect" && (
        <Popup
          title="Connect"
          subtitle="Ubuntu 20.04 or RHEL 8.x"
          closer={setPopup}
          content={
            <ServerConnect
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
      {popup === "aws" && (
        <Popup
          title="Sign in"
          subtitle="Connect to Amazon Web Services"
          closer={setPopup}
          content={
            <AwsLogin
              onSuccess={(res) => {
                setPopup(false);
                if (res) setClient({ aws: res });
              }}
            />
          }
        />
      )}
      {/* TODO: use ansiblerun or convert to api call (like ec2client) */}
      {popup === "vmware" && (
        <Popup
          title="Sign in"
          subtitle="Connect to vCenter"
          closer={setPopup}
          content={
            <VmwareLogin
              onSuccess={(res) => {
                setPopup(false);
                setOutput([]);
                if (res) setClient({ vmware: res });
              }}
            />
          }
        />
      )}
    </Page>
  );
};
