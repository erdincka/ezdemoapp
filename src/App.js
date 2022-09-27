import React, { useEffect, useState } from "react";
import {
  Grommet,
  Button,
  Tabs,
  Tab,
  Page,
  Text,
  NameValueList,
  NameValuePair,
} from "grommet";
import { hpe } from "grommet-theme-hpe";
import { Console, Book, Moon, Sun } from "grommet-icons";
import { HeaderWithActions } from "./Header";
import { FooterWithActions } from "./Footer";
import { Output } from "./Output";
import InstanceCheck from "./InstanceCheck";
import DataFabric from "./DataFabric";
import MLOps from "./MLOps";

function App() {
  const [theme, setTheme] = useState("dark");
  const [mode, setMode] = useState("demo");
  const [output, setOutput] = useState([]);
  const [error, setError] = useState([]);
  // ie, "aws": { "accessKeyId": "", "secretAccessKey": "", "region": "" }
  const [credentials, setCredentials] = useState({});
  const [client, setClient] = useState();
  const [instance, setInstance] = useState();

  const isLearning = mode === "learn";

  // Subscribe to channels for outputs and errors
  useEffect(() => {
    const outputListener = (data) => {
      setOutput([...output, data]);
    };
    const errorListener = (data) => {
      setError([...error, data]);
    };
    window.ezdemoAPI.getOutput((data) => outputListener(data));
    window.ezdemoAPI.getError((data) => errorListener(data));
  }, [error, output]);

  // Component functions
  const themeButton = (
    <Button
      tip="Switch Theme"
      key="theme"
      icon={theme === "dark" ? <Moon /> : <Sun />}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    />
  );

  const modeButton = (
    <Button
      tip={mode + " mode"}
      key="mode"
      icon={mode === "demo" ? <Console /> : <Book />}
      onClick={() => setMode(mode === "demo" ? "learn" : "demo")}
    />
  );

  return (
    <Grommet theme={hpe} themeMode={theme} full>
      <Page>
        <HeaderWithActions buttons={[modeButton, themeButton]} />
        <Tabs justify="start" margin="small">
          <Tab title="Data Fabric">
            <DataFabric
              isLearning={isLearning}
              client={client}
              setClient={setClient}
              instance={instance}
              setInstance={setInstance}
              credentials={credentials}
              setCredentials={setCredentials}
            />
          </Tab>
          <Tab title="MLOps">
            <MLOps />
          </Tab>
        </Tabs>
        {instance && (
          <Tabs justify="start" margin="small">
            <Tab title="Instance">
              <NameValueList>
                <NameValuePair name="Name">
                  <Text color="text-strong">
                    {instance.Tags.filter((t) => t.Key === "Name").map(
                      (t) => t.Value
                    )}
                  </Text>
                </NameValuePair>
                <NameValuePair name="IP Address">
                  <Text color="text-strong">{instance.PublicIpAddress}</Text>
                </NameValuePair>
              </NameValueList>
              <InstanceCheck instance={instance} />
            </Tab>
            <Tab title={output.length > 0 ? "Stdout *" : "Stdout"}>
              <Output output={output} />
            </Tab>
            <Tab title={error.length > 0 ? "Stderr *" : "Stderr"}>
              <Output output={error} />
            </Tab>
          </Tabs>
        )}
        <FooterWithActions params={{ error }} />
      </Page>
    </Grommet>
  );
}

export default App;
