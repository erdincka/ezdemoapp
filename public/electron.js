const { app, BrowserWindow, protocol, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const url = require("url");
const fixPath = "fix-path";

// inherit PATH from dotfiles
fixPath();
// Create the native browser window.
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    // Set the path of an additional "preload" script that can be used to
    // communicate between node-land and browser-land.
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    icon: "public/icons/icon.png",
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : url.format({
          pathname: path.join(__dirname, "../build/index.html"), // relative path to the HTML-file
          protocol: "file:",
          slashes: true,
        })
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

  // Enable connecting to self-signed certificates
  app.on(
    "certificate-error",
    (event, webContents, url, error, certificate, callback) => {
      if (
        url.includes("https://") &&
        (url.includes(":9443") || // installer
          url.includes(":8443") || // MCS
          url.includes(":8047") || // Drill
          url.includes(":3000") || // Grafana
          url.includes(":8888") || // Hue
          url.includes(":5601")) // Kibana
      ) {
        // Verification logic.
        event.preventDefault();
        callback(true);
      } else {
        callback(false);
      }
    }
  );

  // Define IPC calls here
  const {
    ansiblePlay,
    pythonExec,
    getCredentials,
    saveCredentials,
    getPrivateKey,
  } = require("./apiCommands");
  ipcMain.on("ansible", ansiblePlay);
  ipcMain.on("python", pythonExec);
  ipcMain.handle("save_credentials", saveCredentials);
  ipcMain.handle("read_credentials", getCredentials);
  ipcMain.handle("read_privatekey", getPrivateKey);
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
