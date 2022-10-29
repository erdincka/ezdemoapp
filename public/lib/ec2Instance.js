// Import required AWS SDK clients and commands for Node.js
import { ec2Client } from "./ec2Client";
const {
  CreateTagsCommand,
  RunInstancesCommand,
  DescribeInstancesCommand,
  StartInstancesCommand,
  StopInstancesCommand,
} = require("@aws-sdk/client-ec2");

export const createInstance = async (Name, AMI_ID, InstanceType, KeyName) => {
  // Set the parameters
  const instanceParams = {
    ImageId: AMI_ID,
    InstanceType: InstanceType,
    KeyName: KeyName,
    MinCount: 1,
    MaxCount: 1,
  };
  
  try {
    const data = await ec2Client.send(new RunInstancesCommand(instanceParams));
    console.log(data.Instances[0].InstanceId);
    const instanceId = data.Instances[0].InstanceId;
    console.log("Created instance", instanceId);
    // Add tags to the instance
    const tagParams = {
      Resources: [instanceId],
      Tags: [
        {
          Key: "Name",
          Value: Name,
        },
      ],
    };
    try {
      await ec2Client.send(new CreateTagsCommand(tagParams));
      console.log("Instance tagged");
    } catch (err) {
      console.log("Error", err);
    }
  } catch (err) {
    console.log("Error", err);
  }
};

export const getInstances = async () => {
  try {
    const data = await ec2Client.send(new DescribeInstancesCommand({}));
    console.log("Success", JSON.stringify(data));
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

export const startStopInstance = async (command, InstanceId) => {
  // command should be "start" or "stop"
  const params = { InstanceIds: [InstanceId] };
  if (command.toUpperCase() === "START") {
    try {
      const data = await ec2Client.send(new StartInstancesCommand(params));
      console.log("Success", data.StartingInstances);
      return data;
    } catch (err) {
      console.log("Error2", err);
    }
  } else if (process.argv[2].toUpperCase() === "STOP") {
    try {
      const data = await ec2Client.send(new StopInstancesCommand(params));
      console.log("Success", data.StoppingInstances);
      return data;
    } catch (err) {
      console.log("Error", err);
    }
  }
};