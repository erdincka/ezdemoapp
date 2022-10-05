import { createContext } from "react";

export const AppContext = createContext({
  mode: "",
  setMode: () => {},
});

export const ClientContext = createContext({
  client: {},
  setClient: () => {},
});

export const InstanceContext = createContext({
  instance: {},
  setInstance: () => {},
});
