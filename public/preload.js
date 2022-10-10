// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");

// They'll be accessible at "window.ezdemoAPI".
contextBridge.exposeInMainWorld("ezdemoAPI", {
  ansiblePlay: (args) => ipcRenderer.send("ansible", args),
  pythonExec: (args) => ipcRenderer.send("python", args),
  getCredentials: (provider) =>
    ipcRenderer.invoke("read_credentials", provider),
  saveCredentials: (data) => ipcRenderer.invoke("save_credentials", data),
  getPrivateKey: () => ipcRenderer.invoke("read_privatekey", []),
  savePrivateKey: (data) => ipcRenderer.invoke("save_privatekey", data),
  receive: (channel, func) => {
    let validChannels = ["output", "error"];
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
