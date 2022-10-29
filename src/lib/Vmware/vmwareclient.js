const query = async (url, username, password) => {
  const auth_hash = btoa(`${username}:${password}`);
  var options = {
    method: "POST",
    mode: "no-cors",
    headers: new Headers({
      Authorization: `Basic ${auth_hash}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    }),
    // body: JSON.stringify({}),
  };
  const res = await fetch(url, options);
  const resJson = await res.json();
  console.dir(resJson);
  return resJson;
};

export const getVmwareSession = (api_host, username, password) => {
  query(`https://${api_host}/api/session`, username, password);
};
