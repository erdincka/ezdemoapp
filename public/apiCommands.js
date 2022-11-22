const fs = require("fs");
const path = require("path");
const isDev = require("electron-is-dev");
const { getAppDataFilePath } = require("./lib/helpers");
const {
  vmwareSession,
  vmwareGet,
  mcsPost,
  mcsGet,
} = require("./lib/restclient");

const playbook_dir = isDev
  ? path.join(__dirname, "playbooks")
  : path.join(process.resourcesPath, "playbooks");

const privatekey_file = getAppDataFilePath("temp.pem");
const savePrivateKey = (data) => {
  console.dir("Called savePrivateKey");
  console.dir(data);
  // Save private key to temp file
  // TODO: This might be causing Windows fcntl not found error, find alternative
  fs.writeFileSync(privatekey_file, data, { mode: 0o600 }); // should create with user permissions only - merged with process.umask
};

exports.ansiblePlay = (event, args) => {
  // inherit PATH from dotfiles

  let [playbook, vars] = args;
  console.dir("Running playbook '" + playbook + "' with args:");
  console.dir(vars);
  // save private key to file (for aws)
  if (vars.privatekey) savePrivateKey(vars.privatekey);
  // Save ansible inventory
  const hosts_ini = `
  [target]
  ${vars.address} ansible_connection=ssh ansible_user=${vars.username} ansible_ssh_private_key_file="${privatekey_file}"
  [local]
  localhost ansible_connection=local
  [all:vars]
  [inventory]
  enable_plugins=community.vmware.vmware_host_inventory
  `;
  const hosts_ini_file = getAppDataFilePath("hosts.ini");
  fs.writeFileSync(hosts_ini_file, hosts_ini);

  var Ansible = require("node-ansible");
  var command =
    playbook === "ping"
      ? new Ansible.AdHoc()
          .inventory(hosts_ini_file)
          .hosts("target")
          .module("ping")
          .verbose("v")
      : new Ansible.Playbook()
          .inventory(hosts_ini_file)
          .playbook(`${playbook_dir}/${playbook}`)
          .variables(vars)
          .verbose("v");

  command.on("stdout", (data) => {
    console.log(`STDOUT: ${data.toString()}`);
    event.sender.send("output", data.toString());
  });
  command.on("stderr", (data) => {
    // ignore python warning on macos
    if (!data.includes("Platform darwin on host")) {
      console.error(`STDERR: ${data}`);
      event.sender.send("error", data.toString());
    }
  });
  command.exec();
};

// exports.getCredentials = (_, provider) => {
//   console.dir("Called getCredentials: " + provider);
//   const config_file = getAppDataFilePath(`/${provider}.json`);
//   let data;
//   try {
//     data = fs.readFileSync(config_file, { encoding: "utf8" });
//   } catch (error) {
//     if (error.code === "ENOENT") console.error(config_file + " not found");
//   }
//   return data;
// };

// exports.saveCredentials = (_, data) => {
//   console.dir("Called saveCredentials");
//   console.dir(data);
//   Object.keys(data).forEach((key) => {
//     const config_file = getAppDataFilePath(key + ".json");
//     fs.writeFile(config_file, JSON.stringify(data[key]), (error) => {
//       if (error) console.error(error);
//     });
//   });
//   return "Saved";
// };

// exports.getPrivateKey = (_) => {
//   console.dir("Called getPrivateKey");
//   let data;
//   try {
//     data = fs.readFileSync(privatekey_file, { encoding: "utf8" });
//   } catch (error) {
//     if (error.code === "ENOENT") console.error(privatekey_file + " not found");
//   }
//   return data;
// };

exports.queryVcenter = (_, args) => {
  console.dir("Called vcenter");
  console.dir(args);
  switch (args.request) {
    case "session":
      return vmwareSession(args.address, args.username, args.password);

    default:
      return vmwareGet(args.address, args.session, args.request);
    // break;
  }
};

exports.queryMcs = (_, args) => {
  console.dir("Called MCS rest");
  console.dir(args);
  switch (args.request) {
    // case "session":
    //   return mcsSession(args);

    case "post":
      return mcsPost(args);

    default:
      return mcsGet(args);
    // break;
  }
};
