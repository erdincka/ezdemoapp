import { Box, Button, FileInput } from "grommet";
import { useEffect, useState } from "react";

function InstanceCheck(props) {
  const [privatekey, setPrivatekey] = useState();
  const { instance } = props;

  useEffect(() => {
    const queryAsync = async () => {};
    queryAsync();
  }, []);

  const gatherFacts = async () => {
    let vars = {
      ip: instance.PublicIpAddress,
      // TODO: username should be fixed for AWS/Azure/Vmware images
      username:
        instance.PlatformDetails === "Linux/UNIX" ? "ubuntu" : "ec2-user",
      privatekey: privatekey,
    };
    window.ezdemoAPI.ansiblePlay(["check", vars]);
  };

  // Get private key content from uploaded file
  const readPrivateKey = (files) => {
    if (files.length === 1) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        setPrivatekey(e.target.result);
      };
      reader.readAsText(files[0]);
    }
  };

  return (
    <Box margin="medium">
      <FileInput
        name="privatekey"
        multiple={false}
        onChange={({ target: { files } }) => {
          readPrivateKey(files);
        }}
      />
      <Button onClick={gatherFacts} label="Connect" disabled={!privatekey} />
      {/* <pre>{JSON.stringify(instance, null, 2)}</pre> */}
    </Box>
  );
}

export default InstanceCheck;
