import React, { useContext, useEffect, useMemo, useState } from "react";
import { Grommet, Button, ResponsiveContext, Box, PageHeader } from "grommet";
import { hpe } from "grommet-theme-hpe";
import { Console, Book, Moon, Sun, Code, AppsRounded } from "grommet-icons";
import { GlobalHeader } from "./Header";
import { GlobalFooter } from "./Footer";
import { AppContext } from "./ContextProviders";
import { DataFabric } from "./DataFabric";
import { errorBar } from "./libs/Utils";
import { LogViewer } from "./LogViewer";

function App() {
  const [learning, setLearning] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [debug, setDebug] = useState(false);
  const [output, setOutput] = useState([]);
  const [error, setError] = useState([]);
  const [connection, setConnection] = useState({});

  const size = useContext(ResponsiveContext);
  // Subscribe to channels for output
  useEffect(() => {
    const processOutput = (data) => setOutput((old) => [...old, data]);
    const removeListener = window.ezdemoAPI.receive("output", processOutput);
    return () => removeListener();
  }, [output]);

  // Subscribe to channels for errors
  useEffect(() => {
    const processError = (data) => setError((old) => [...old, data]);
    const removeListener = window.ezdemoAPI.receive("error", processError);
    return () => removeListener();
  }, [error]);

  const contextValue = useMemo(
    () => ({
      size,
      learning,
      setLearning,
      output,
      setOutput,
      error,
      setError,
      connection,
      setConnection,
      debug,
    }),
    [size, learning, error, output, connection, debug]
  );

  // Component functions
  const themeButton = (
    <Button
      tip={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      key="theme"
      icon={theme === "dark" ? <Moon /> : <Sun />}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    />
  );

  const modeButton = (
    <Button
      tip="Demo/Learn Mode"
      key="mode"
      icon={learning ? <Book /> : <Console />}
      onClick={() => setLearning(!learning)}
    />
  );

  const debugButton = (
    <Button
      tip="Advanced / Basic"
      key="debug"
      icon={debug ? <Code /> : <AppsRounded />}
      onClick={() => setDebug(!debug)}
    />
  );

  return (
    <Grommet theme={hpe} themeMode={theme} full>
      <AppContext.Provider value={contextValue}>
        <Box width={{ max: "xxlarge" }} margin="auto" fill>
          <GlobalHeader buttons={[debugButton, modeButton, themeButton]} />
          {errorBar(error, setError)}

          <Box overflow="auto">
            <Box
              background="background"
              justify="center"
              pad={{
                horizontal: !["xsmall", "small"].includes(size)
                  ? "xlarge"
                  : "medium",
                vertical: "large",
              }}
              flex={false}
            >
              <Box gap="large">
                {learning ? (
                  <PageHeader
                    title="Learn by doing"
                    subtitle="Try it yourself, on your own environment, in your own pace"
                  />
                ) : (
                  <PageHeader
                    title="Demo Mode"
                    subtitle="Try and demo Ezmeral live"
                  />
                )}
              </Box>

              <DataFabric />
              {/* <MLOps /> */}
              {debug && <LogViewer lines={output} />}
            </Box>
          </Box>

          <GlobalFooter />
        </Box>
      </AppContext.Provider>
    </Grommet>
  );
}

export default App;
