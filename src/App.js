import React, { useEffect, useMemo, useState } from "react";
import { Grommet, Button, Box } from "grommet";
import { hpe } from "grommet-theme-hpe";
import {
  Console,
  Book,
  Moon,
  Sun,
  Code,
  AppsRounded,
  Refresh,
} from "grommet-icons";
import { GlobalHeader } from "./Header";
import { GlobalFooter } from "./Footer";
import { AppContext } from "./ContextProviders";
import { errorBar } from "./lib/Utils";
import { LogViewer } from "./lib/LogViewer";
import { Outlet } from "react-router-dom";

export function App() {
  const [learning, setLearning] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [debug, setDebug] = useState(false);
  const [output, setOutput] = useState([]);
  const [error, setError] = useState([]);
  const [client, setClient] = useState({});
  const [connection, setConnection] = useState({});

  // Subscribe to channels for output
  useEffect(() => {
    const processOutput = (data) => setOutput((old) => [...old, data]);
    const removeListener = window.ezdemoAPI.receive("output", processOutput);
    return () => removeListener();
  }, [output]);

  // Subscribe to channels for errors
  useEffect(() => {
    const processError = (data) => {
      setError((old) => [...old, data]);
    };
    const removeListener = window.ezdemoAPI.receive("error", processError);
    return () => removeListener();
  }, [error]);

  const contextValue = useMemo(
    () => ({
      learning,
      setLearning,
      output,
      setOutput,
      error,
      setError,
      connection,
      setConnection,
      debug,
      client,
      setClient,
    }),
    [learning, output, error, connection, debug, client]
  );

  const reset = () => {
    setConnection({});
    setClient({});
  };
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

  const refreshButton = (
    <Button
      tip="Reset"
      key="reset"
      icon={<Refresh />}
      onClick={reset} // reset the connection & client - should take everything to beginning
    />
  );

  return (
    <Grommet theme={hpe} themeMode={theme} full>
      <AppContext.Provider value={contextValue}>
        <GlobalHeader
          buttons={[refreshButton, debugButton, modeButton, themeButton]}
        />
        {errorBar(error, setError)}
        <Box width={{ width: "100%" }} height={{ min: "82%" }} margin="auto">
          <Outlet />

          {debug && <LogViewer lines={output} />}
        </Box>

        <GlobalFooter />
      </AppContext.Provider>
    </Grommet>
  );
}
