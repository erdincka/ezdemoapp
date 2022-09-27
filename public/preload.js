// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");

// They'll be accessible at "window.ezdemoAPI".
contextBridge.exposeInMainWorld('ezdemoAPI', {
  ansiblePlay: (args) => ipcRenderer.send('ansible', args),
  pythonExec: (args) => ipcRenderer.send('python', args),
  sshExec: (args) => ipcRenderer.send('ssh', args),
  getCredentials: (provider) => ipcRenderer.invoke('read_credentials', provider),
  saveCredentials: (data) => ipcRenderer.invoke('save_credentials', data),
  getOutput: (callback) => ipcRenderer.on('output', (_, data) => { callback(data) }),
  getError: (callback) => ipcRenderer.on('error', (_, data) => { callback(data) }),
})
