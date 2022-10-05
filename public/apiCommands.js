///
const fs = require("fs");

const cwd = process.cwd();
const privatekey_file = `${cwd}/temp.pem`;

exports.ansiblePlay = (event, args) => {
  let [playbook, vars] = args;
  console.dir("Running playbook '" + playbook + "' with args:");
  console.dir(vars);
  // Save ansible inventory
  const hosts_ini = `
  [target]
  ${vars.ip}
  [all:vars]
  ansible_connection=ssh
  ansible_user=${vars.username}
  ansible_ssh_private_key_file=${privatekey_file}
  `;
  const hosts_ini_file = `${cwd}/hosts.ini`;
  fs.writeFileSync(hosts_ini_file, hosts_ini);

  var Ansible = require("node-ansible");
  var command = new Ansible.Playbook()
    .inventory(hosts_ini_file)
    .playbook(`${cwd}/public/playbooks/${playbook}`)
    .variables(vars);
  // .verbose("v");

  command.on("stdout", (data) => {
    // console.log(`STDOUT: ${data}`);
    event.sender.send("output", data.toString());
  });
  command.on("stderr", (data) => {
    console.error(`STDERR: ${data}`);
    event.sender.send("error", data.toString());
  });
  command.exec();
};

exports.pythonExec = (_, script) => {
  console.dir("Running python script", script);
  // const { spawn } = require("child_process");
  // return spawn("python3", [script]);
};

exports.getCredentials = (_, provider) => {
  console.dir("Called getCredentials: " + provider);
  const config_file = `${cwd}/${provider}.json`;
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
    const config_file = key + ".json";
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

exports.savePrivateKey = (_, data) => {
  console.dir("Called savePrivateKey");
  console.dir(data);
  // Save private key to temp file
  fs.writeFileSync(privatekey_file, data, { mode: 0o600 }); // should create with user permissions only - merged with process.umask
  return "Saved";
};
