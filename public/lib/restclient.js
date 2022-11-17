const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const https = require("https");
const { urlToHttpOptions } = require("url");

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

const https_request = (data) => {
  const options = urlToHttpOptions(new URL(data.address));
  options.agent = httpsAgent;
  options.auth = data.username + ":" + data.password;
  options.method = data.request;

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error("statusCode=" + res.statusCode));
      }
      var body = [];
      res.on("data", function (chunk) {
        body.push(chunk);
      });
      res.on("end", function () {
        try {
          body = JSON.parse(Buffer.concat(body).toString());
        } catch (e) {
          reject(e);
        }
        resolve(body);
      });
    });
    req.on("error", (e) => {
      reject(e.message);
    });
    // send the request
    req.end();
  });
};

// exports.mcsSession = async (data) => {
//   var formData = new URLSearchParams();
//   formData.append("username", data.username);
//   formData.append("password", data.password);

//   var requestOptions = {
//     method: "POST",
//     agent: httpsAgent,
//     body: formData,
//   };

//   try {
//     return fetch(data.address, requestOptions)
//       .then(
//         (response) =>
//           // response.headers.get("set-cookie")
//           response
//       )
//       .then((data) => data.json());
//   } catch (error) {
//     return { error };
//   }
// };

exports.mcsPost = async (data) => {
  var formData = new URLSearchParams();
  formData.append("username", data.username);
  formData.append("password", data.password);

  var requestOptions = {
    method: "POST",
    // mode: "no-cors",
    // redirect: "follow",
    agent: httpsAgent,
    body: formData,
  };

  try {
    return fetch(data.address, requestOptions).then((response) => response);
  } catch (error) {
    return { error };
  }
};

exports.mcsGet = async (data) => {
  data.request = "GET";
  return https_request(data);
};
