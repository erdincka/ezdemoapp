import {
  Box,
  Button,
  Heading,
  Image,
  Page,
  PageHeader,
  Spinner,
  Text,
  ThemeContext,
} from "grommet";
import { prism } from "grommet-theme-hpe";

import { Ezmeral, Launch } from "grommet-icons";
import { useNavigate, useParams } from "react-router-dom";
import { ReverseAnchor } from "./ReverseAnchor";
import { BrowserLink, copyToClipboard, runAnsible } from "./Utils";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../ContextProviders";
import { getAnsibleResponse } from "./getAnsibleResponse";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export const Story = () => {
  const { address, story } = useParams();
  const navigate = useNavigate();
  const theme = useContext(ThemeContext);
  const { output, setOutput, setError } = useContext(AppContext);

  const [wait, setWait] = useState(false);

  // monitor output
  useEffect(() => {
    getAnsibleResponse(output, "runscript")
      .then((data) => {
        console.dir(data);
      })
      .catch((error) => {
        setError((prev) => [...prev, error]);
      })
      .finally(() => {
        setWait(false);
      });
  }, [output, setError]);

  const clusters = JSON.parse(localStorage.getItem("clusters"));
  const getClusterHost = (addr) => clusters.find((c) => c.address === addr);

  const cluster = getClusterHost(address);
  // const getClusterName = (address) =>
  //   getClusterHost(address).cluster_name || address;

  const runAnsibleFor = (play) => {
    setOutput([]);
    if (runAnsible("runscript", { script: play, ...cluster })) {
      setWait(true);
    }
  };

  const Code = ({ language = "sh", content }) => (
    <SyntaxHighlighter
      style={theme.dark ? prism.dark : prism.light}
      wrapLongLines
      language={language}
    >
      {content}
    </SyntaxHighlighter>
  );

  const openDrill = (
    <Text>
      Open <BrowserLink url={`https://${address}:8047/query`} label="Drill" />
      and run following query (login with user: mapr, and password you've set
      for cluster admin (default: mapr)).
    </Text>
  );

  const content = () => {
    switch (story) {
      case "Stock Market Demo":
        return (
          <Box>
            <Image src="https://github.com/mapr-demos/finserv-application-blueprint/blob/master/images/dataflow.gif?raw=true" />

            {openDrill}

            <Code
              language="sql"
              content="SELECT * FROM dfs.`/user/mapr/ticktable` LIMIT 10;"
            />
          </Box>
        );

      case "Kafka Samples":
        return <Box gap="small"></Box>;

      case "Satellite Images":
        return (
          <Box gap="small">
            {openDrill}
            <Code
              language="sql"
              content="SELECT * FROM dfs.`/apps/satellite` LIMIT 10;"
            />
            Open <BrowserLink label="SuperSet" url={``} /> and add Database
            <Code
              language="sql"
              content="drill+sadrill://localhost:8047/dfs?use_ssl=False"
            />
          </Box>
        );

      default:
        break;
    }
  };

  return (
    <Page pad={{ horizontal: "medium" }}>
      <PageHeader
        title={story}
        parent={<ReverseAnchor label="Back" onClick={() => navigate(-1)} />}
        actions={
          <Button
            icon={<Ezmeral color="plain" />}
            onClick={() => copyToClipboard(address)}
          />
        }
        pad={{ vertical: "medium" }}
      />
      <Heading level={5}>{cluster.cluster_name || address}</Heading>
      <Box gap="small" direction="row" align="center" justify="start">
        <Button
          secondary
          label="Start scenario"
          onClick={() => runAnsibleFor(story)}
        />
        {wait ? <Spinner /> : <Launch />}
      </Box>
      {content()}
    </Page>
  );
};
