///
const fs = require("fs");

const cwd = process.cwd();

exports.ansiblePlay = (event, args) => {
  let [playbook, vars] = args;
  console.dir("Running playbook: " + playbook + " with args:");
  console.dir(vars);
  // Save private key to temp file
  const prv_key = `${cwd}/temp.pem`;
  fs.writeFileSync(prv_key, vars.privatekey, { mode: 0o600 }); // should create with user permissions only - merged with process.umask
  // Save ansible inventory
  const hosts_ini = `
  [target]
  ${vars.ip}
  [all:vars]
  ansible_connection=ssh
  ansible_user=${vars.username}
  ssh_prv_key=${prv_key}
  `;
  const hosts_ini_file = `${cwd}/public/playbooks/hosts.ini`;
  fs.writeFileSync(hosts_ini_file, hosts_ini);

  // const ansible_cfg = `
  // [defaults]
  // callback_whitelist=json
  // stdout_callback=json
  // `;
  // const ansible_cfg_file = "./ansible.cfg";
  // fs.writeFileSync(ansible_cfg_file, ansible_cfg);

  var Ansible = require("node-ansible");
  var command = new Ansible.Playbook()
    .inventory(hosts_ini_file)
    .playbook(`${cwd}/public/playbooks/${playbook}`)
    .variables(vars)
    .verbose("v");

  command.on("stdout", (data) => {
    console.log(`STDOUT: ${data}`);
    event.sender.send("output", data.toString());
  });
  command.on("stderr", (data) => {
    console.error(`STDERR: ${data}`);
    event.sender.send("error", data.toString());
  });
  return command.exec();
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
  // event.sender.send(data);
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
