const { app, BrowserWindow, protocol, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

// Create the native browser window.
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 600,
    // Set the path of an additional "preload" script that can be used to
    // communicate between node-land and browser-land.
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "attach" });
  }
}

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    }
  );
}

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  // console.dir(process.platform)
  setupLocalFilesNormalizerProxy();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Define IPC calls here
  const {
    ansiblePlay,
    pythonExec,
    getCredentials,
    saveCredentials,
    getPrivateKey,
    savePrivateKey,
  } = require("./apiCommands");
  ipcMain.on("ansible", ansiblePlay);
  ipcMain.on("python", pythonExec);
  ipcMain.handle("save_credentials", saveCredentials);
  ipcMain.handle("read_credentials", getCredentials);
  ipcMain.handle("read_privatekey", getPrivateKey);
  ipcMain.handle("save_privatekey", savePrivateKey);
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
