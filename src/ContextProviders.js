import { createContext } from "react";

export const AppContext = createContext({
  learning: Boolean,
  setLearning: () => {},
  output: [],
  setOutput: () => {},
  error: [],
  setError: () => {},
  connection: {},
  setConnection: () => {},
});

export const AwsContext = createContext({
  client: {},
  setClient: () => {},
});

// export const InstanceContext = createContext({
//   instance: {},
//   setInstance: () => {},
// });
