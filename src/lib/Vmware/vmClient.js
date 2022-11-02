import { df_min_cores, df_min_memory } from "../Utils";

export const listVms = (address, sessionId) => {
  const vars = {
    address: address,
    request: "vm",
    session: sessionId,
  };
  return window.ezdemoAPI.queryVcenter(vars);
};

export const filteredVms = (vms) =>
  vms.filter(
    (v) => v.memory_size_MiB > df_min_memory && v.cpu_count >= df_min_cores
  );
