const path = require("path");
const fs = require("fs");
const APPNAME = "ezdemo";

const getAppDataFilePath = (filename) => {
  let appDataPath = "";
  switch (process.platform) {
    case "darwin": {
      appDataPath = path.join(
        process.env.HOME,
        "Library",
        "Application Support",
        APPNAME
      );
      break;
    }
    case "win32": {
      appDataPath = path.join(process.env.APPDATA, APPNAME);
      break;
    }
    case "linux": {
      appDataPath = path.join(process.env.HOME, "." + APPNAME);
      break;
    }
    default: {
      console.log("Unsupported platform!");
      // process.exit(1);
      const os = require("os");
      appDataPath = os.tmpdir(); // optimisticly set temp folder
    }
  }
  if (!fs.existsSync(appDataPath)) {
    fs.mkdirSync(appDataPath);
  }
  return path.join(appDataPath, filename);
};

module.exports = { getAppDataFilePath };
