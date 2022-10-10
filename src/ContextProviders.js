import { createContext } from "react";

export const AppContext = createContext({
  learning: Boolean,
  setLearning: () => {},
  output: [],
  setOutput: () => {},
  error: [],
  setError: () => {},
});

export const ClientContext = createContext({
  client: {},
  setClient: () => {},
});

export const InstanceContext = createContext({
  instance: {},
  setInstance: () => {},
});
