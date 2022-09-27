import { DescribeKeyPairsCommand, CreateKeyPairCommand, DeleteKeyPairCommand } from "@aws-sdk/client-ec2";
import { ec2Client } from "./ec2Client";
export const getKeyPairs = async () => {
  try {
    const data = await ec2Client.send(new DescribeKeyPairsCommand({}));
    console.log("Success", JSON.stringify(data.KeyPairs));
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

export const createKeyPair = async (KeyName) => {
  try {
    const data = await ec2Client.send(new CreateKeyPairCommand({ KeyName: KeyName }));
    console.log(JSON.stringify(data));
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

export const deleteKeyPair = async (KeyName) => {
  try {
    const data = await ec2Client.send(new DeleteKeyPairCommand({ KeyName: KeyName }));
    console.log("Key Pair Deleted");
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

