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
  client: {},
  setClient: () => {},
});
