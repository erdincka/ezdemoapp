const fs = require("fs");
const path = require("path");
const isDev = require("electron-is-dev");
const { getAppDataFilePath } = require("./libs/helpers");

const playbook_dir = isDev
  ? path.join(__dirname, "playbooks")
  : path.join(process.resourcesPath, "playbooks");

const privatekey_file = getAppDataFilePath("temp.pem");
const savePrivateKey = (data) => {
  console.dir("Called savePrivateKey");
  console.dir(data);
  // Save private key to temp file
  fs.writeFileSync(privatekey_file, data, { mode: 0o600 }); // should create with user permissions only - merged with process.umask
};

exports.ansiblePlay = (event, args) => {
  // inherit PATH from dotfiles

  let [playbook, vars] = args;
  console.dir("Running playbook '" + playbook + "' with args:");
  console.dir(vars);
  // save private key to file
  savePrivateKey(vars.privatekey);
  // Save ansible inventory
  const hosts_ini = `
  [target]
  ${vars.address}
  [all:vars]
  ansible_connection=ssh
  ansible_user=${vars.username}
  ansible_ssh_private_key_file=${privatekey_file}
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
    console.error(`STDERR: ${data}`);
    event.sender.send("error", data.toString());
  });
  command.exec();
};

exports.pythonExec = (_, script) => {
  console.dir("Will be Running python script", script);
  // const { spawn } = require("child_process");
  // return spawn("python3", [script]);
};

exports.getCredentials = (_, provider) => {
  console.dir("Called getCredentials: " + provider);
  const config_file = getAppDataFilePath(`/${provider}.json`);
  let data;
  try {
    data = fs.readFileSync(config_file, { encoding: "utf8" });
  } catch (error) {
    if (error.code === "ENOENT") console.error(config_file + " not found");
  }
  return data;
};

exports.saveCredentials = (_, data) => {
  console.dir("Called saveCredentials");
  console.dir(data);
  Object.keys(data).forEach((key) => {
    const config_file = getAppDataFilePath(key + ".json");
    fs.writeFile(config_file, JSON.stringify(data[key]), (error) => {
      if (error) console.error(error);
    });
  });
  return "Saved";
};

exports.getPrivateKey = (_) => {
  console.dir("Called getPrivateKey");
  let data;
  try {
    data = fs.readFileSync(privatekey_file, { encoding: "utf8" });
  } catch (error) {
    if (error.code === "ENOENT") console.error(privatekey_file + " not found");
  }
  return data;
};
