import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Grommet,
  Button,
  ResponsiveContext,
  Box,
  PageHeader,
  Notification,
} from "grommet";
import { hpe } from "grommet-theme-hpe";
import { Console, Book, Moon, Sun } from "grommet-icons";
import { GlobalHeader } from "./Header";
import { GlobalFooter } from "./Footer";
import { AppContext } from "./ContextProviders";
import DataFabric from "./libs/DataFabric";

function App() {
  const [theme, setTheme] = useState("dark");
  const [learning, setLearning] = useState(false);
  const size = useContext(ResponsiveContext);
  const [output, setOutput] = useState([]);
  const [error, setError] = useState([]);

  useEffect(() => {
    const outputListener = (data) => {
      setOutput([...output, data]);
    };
    window.ezdemoAPI.getOutput((data) => outputListener(data));
  }, [output]);

  // Subscribe to channels for errors
  useEffect(() => {
    const errorListener = (data) => {
      setError([...error, data]);
    };
    window.ezdemoAPI.getError((data) => errorListener(data));
  }, [error]);

  const contextValue = useMemo(
    () => ({
      learning,
      setLearning,
      output,
      setOutput,
      error,
      setError,
    }),
    [learning, error, output]
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

  return (
    <Grommet theme={hpe} themeMode={theme} full>
      <AppContext.Provider value={contextValue}>
        <Box width={{ max: "xxlarge" }} margin="auto" fill>
          <GlobalHeader buttons={[modeButton, themeButton]} />
          {error.length > 0 && (
            <Notification
              status="critical"
              onClose={() => {
                setError([]);
              }}
              message={error}
              global
            />
          )}

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
                    title="Demo"
                    subtitle="Setup and run your own live Ezmeral demos"
                  />
                )}
              </Box>

              <DataFabric />
            </Box>
          </Box>
          <GlobalFooter />
        </Box>
      </AppContext.Provider>
    </Grommet>
  );
}

export default App;
