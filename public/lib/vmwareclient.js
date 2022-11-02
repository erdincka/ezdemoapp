const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const https = require("https");

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

exports.vmwareSession = async (address, username, password) => {
  var requestOptions = {
    method: "POST",
    mode: "no-cors",
    headers: {
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
    },
    redirect: "follow",
    agent: httpsAgent,
  };

  try {
    const response = await fetch(
      `https://${address}/rest/com/vmware/cis/session`,
      requestOptions
    );
    return await response.json();
  } catch (error) {
    return { error };
  }
};

exports.vmwareGet = async (address, token, path) => {
  var requestOptions = {
    method: "GET",
    mode: "no-cors",
    headers: {
      "vmware-api-session-id": token,
    },
    redirect: "follow",
    agent: httpsAgent,
  };

  try {
    const response = await fetch(
      `https://${address}/rest/vcenter/${path}`,
      requestOptions
    );
    const data = await response.json();
    // console.dir(data.value);
    return data.value;
  } catch (error) {
    return { error };
  }
};
