import { Box, Button, Clock, DataChart, Grid, Select, Text } from "grommet";
import {
  CloudDownload,
  Cubes,
  Iteration,
  Time,
  Transaction,
} from "grommet-icons";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../ContextProviders";
import { getAnsibleResponse } from "./getAnsibleResponse";
import { NavigationCard } from "./NavigationCard";
import { runAnsible } from "./Utils";

export const DataFabricUseCases = ({ host }) => {
  const [ingestionUC, setIngestionUC] = useState();
  // const [ansibleRunFor, setAnsibleRunFor] = useState();
  const [timer, setTimer] = useState();
  const [topics, setTopics] = useState([]);

  const { output, setError } = useContext(AppContext);

  // Parse coundown timer
  let minutes = parseInt(timer / 60, 10) || 0;
  let seconds = parseInt(timer % 60, 10) || 0;
  const timeout =
    "T00:" +
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (seconds < 10 ? "0" + seconds : seconds);

  const restEndpoint = "https://" + host.fqdn + ":8443";

  useEffect(() => {
    let interval = null;

    if (timer) {
      interval = setInterval(() => {
        setTimer((time) => --time);
        if (timer === 0) {
          setTimer(); // reset timer
        }
      }, 1000);
    } else {
      setTimer(); // reset timer
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  // obtain session cookie
  // useEffect(() => {
  //   const createOrUpdateSession = () => {
  //     if (!session) {
  //       const restdata = {
  //         request: "post",
  //         address: restEndpoint + "/login",
  //         username: "mapr",
  //         password: host.my_admin_password || "mapr",
  //       };
  //       window.ezdemoAPI.queryMcs(restdata).then((data) => {
  //         if (data.authenticated) setSession(data);
  //       });
  //       // .then((response) => setSession(response));
  //     }
  //   };
  //   createOrUpdateSession();
  // }, [host.my_admin_password, restEndpoint, session]);

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
        // setWait(false);
      });
  }, [output, setError]);

  const startIngestion = () => {
    // setOutput([]);
    // setAnsibleRunFor(ingestionUC);
    setTimer(1 * 60); // 5 minute countdown
    runAnsible("runscript", { ...host, script: ingestionUC.script });
  };

  const requestOptions = {
    request: "get",
    username: "mapr",
    password: host.my_admin_password || "mapr",
  };

  const getTopics = () => {
    requestOptions.address = `${restEndpoint}/rest/stream/topic/list?path=demostream`;
    window.ezdemoAPI.queryMcs(requestOptions).then((response) => {
      if (response.status === "OK") setTopics(response.data);
    });
    topics.forEach((t) => {
      requestOptions.address = `${restEndpoint}/rest/stream/topic/list?path=demostream&topic=\${t}`;
      window.ezdemoAPI.queryMcs(requestOptions).then((response) => {
        console.dir(response.data);
        if (response.status === "OK") {
          // setTopics((old) => (old[t] = response.data));
        }
      });
    });
  };
  const ingestionUseCases = [
    {
      name: "Random data",
      script: "producer.py",
      topic: "random",
    },
    {
      name: "Satellite images from ESA",
      script: "hapi_producer.py",
      topic: "satellite",
    },
    {
      name: "Batch load from Kaggle",
      script: "kaggle.py",
      topic: "kaggle",
    },
  ];

  const useCases = [
    {
      name: "Data Ingestion",
      description: (
        <Box>
          <Text>
            Data ingestion from selected sources, will push messages to their
            dedicated topics for 5 minutes
          </Text>
          <Box direction="row" justify="between">
            <Text>
              {ingestionUC ? "Target topic: " + ingestionUC?.topic : ""}
            </Text>
            {timer && (
              <Clock
                margin="none"
                alignSelf="end"
                type="digital"
                run={timer ? "backward" : false}
                size="small"
                time={timeout}
              />
            )}
          </Box>
        </Box>
      ),
      icon: <CloudDownload />,
      action: (
        <Box direction="row" gap="small" justify="between">
          <Select
            placeholder="Data from..."
            options={ingestionUseCases}
            value={ingestionUC}
            onChange={({ option }) => setIngestionUC(option)}
            disabled={timer ? true : false}
          />
          <Button
            secondary
            label={ingestionUC ? "Start" : "Select"}
            disabled={!ingestionUC || timer !== undefined}
            onClick={startIngestion}
          />
        </Box>
      ),
    },
    {
      name: "Realtime Processing",
      description: (
        <Box>
          <Text>Data processing as it is ingested using streams</Text>
          <DataChart />
        </Box>
      ),
      icon: <Time />,
      action: <Button onClick={getTopics} label="Topics" />,
    },
    {
      name: "Batch Query",
      description: "",
      icon: <Cubes />,
      action: "Select",
    },
    {
      name: "Transform",
      description: "",
      icon: <Transaction />,
      action: "Select",
    },
    {
      name: "Workflows",
      description: "",
      icon: <Iteration />,
      action: "Select",
    },
  ];

  return (
    <Box>
      <pre>{JSON.stringify(topics, 0, 2)}</pre>
      <Grid columns={["auto", "auto"]} gap="medium">
        {useCases.map((uc) => (
          <NavigationCard
            key={uc.name}
            height="medium"
            title={uc.name}
            description={uc.description}
            icon={uc.icon}
            action={uc.action}
          />
        ))}
      </Grid>
    </Box>
  );
};
