// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");

// They'll be accessible at "window.ezdemoAPI".
contextBridge.exposeInMainWorld("ezdemoAPI", {
  ansiblePlay: (args) => ipcRenderer.send("ansible", args),
  openInBrowser: (args) => ipcRenderer.send("browse", args),
  queryVcenter: (args) => ipcRenderer.invoke("vcenter", args),
  queryMcs: (args) => ipcRenderer.invoke("mcs", args),
  getPlatform: () => ipcRenderer.invoke("platform"),
  // getCredentials: (src) => ipcRenderer.invoke("read_credentials", src),
  // saveCredentials: (data) => ipcRenderer.invoke("save_credentials", data),
  // getPrivateKey: () => ipcRenderer.invoke("read_privatekey", []),
  receive: (channel, func) => {
    let validChannels = ["output", "error", "command1out", "command2out"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      const subscription = (event, ...args) => func(...args);
      ipcRenderer.on(channel, subscription);
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    }
  },
});
