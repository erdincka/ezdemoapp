import { Redhat, Ubuntu } from "grommet-icons";

const AWS = require("aws-sdk");

export const instance_user = (i) =>
  i.PlatformDetails === "Linux/UNIX" ? "ubuntu" : "ec2-user";

export const instance_icon = (i) =>
  i.PlatformDetails === "Linux/UNIX" ? (
    <Ubuntu size="medium" color="plain" />
  ) : (
    <Redhat size="medium" color="plain" />
  );

const AmiParams = {
  Filters: [
    {
      Name: "name",
      Values: [
        // "ami7.1-i3en.xlarge", // HPE AMIs
        "ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-20220914",
        // "RHEL-8.6.0_HVM-20220503-x86_64*",
      ],
    },
    {
      Name: "state",
      Values: ["available"],
    },
  ],
  Owners: [
    // "746013851261", // HPE AMIs
    "099720109477", // Amazon - Canonical
    // "309956199498", // Redhat
  ],
};

export const configureClient = async (accessKeyId, secretAccessKey, region) => {
  if (region === "") return null;
  AWS.config.update({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
  try {
    const client = new AWS.EC2({ apiVersion: "2016-11-15" });
    const checkClient = await getRegions(client);
    // console.dir(checkClient);
    if (checkClient) return client;
    else return null;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    // console.dir('DONE: getAMIs');
  }
};

export const getAMIs = async (ec2client) => {
  if (!ec2client) return null;
  try {
    const data = await ec2client.describeImages(AmiParams).promise();
    // console.dir(data.Images);
    return data.Images;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    // console.dir('DONE: getAMIs');
  }
};

export const getRegions = async (ec2client) => {
  if (!ec2client) return null;
  try {
    const data = await ec2client.describeRegions({}).promise();
    return data.Regions;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    // console.dir('DONE: getRegions');
  }
};

export const getKeyPairs = async (ec2client) => {
  if (!ec2client) return null;
  var params = {
    IncludePublicKey: true,
  };
  try {
    const data = await ec2client.describeKeyPairs(params).promise();
    return data.KeyPairs;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    // console.dir('DONE: getKeyPairs');
  }
};

const getDefaultVpc = async (ec2client) => {
  if (!ec2client) return null;
  const params = {
    Filters: [
      {
        Name: "is-default",
        Values: ["true"],
      },
    ],
  };
  const data = await ec2client.describeVpcs(params).promise();
  return data.Vpcs[0];
};

export const getSecurityGroups = async (ec2client) => {
  if (!ec2client) return null;
  const defaultVpc = await getDefaultVpc(ec2client);
  const params = {
    Filters: [
      {
        Name: "vpc-id",
        Values: [defaultVpc.VpcId],
      },
    ],
  };
  try {
    const data = await ec2client.describeSecurityGroups(params).promise();
    return data.SecurityGroups;
  } catch (error) {
    console.dir(error);
    return null;
  } finally {
    // console.dir('DONE: getSecurityGroups');
  }
};

export const getInstance = async (ec2client, instanceId) => {
  if (!ec2client) return null;
  var params = {
    InstanceIds: [instanceId],
  };
  try {
    const data = await ec2client.describeInstances(params).promise();
    if (data.Reservations.length > 0) {
      return data.Reservations.map((res) => res.Instances).flat()[0]; // return first result
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    // console.dir('DONE: getInstances');
  }
};

export const getInstances = async (ec2client) => {
  if (!ec2client) return null;
  const allowedImageIds = (await getAMIs(ec2client))?.map((ami) => ami.ImageId);
  var params = {
    Filters: [
      {
        Name: "instance-state-name",
        Values: ["running"],
      },
      {
        Name: "architecture",
        Values: ["x86_64"],
      },
      {
        Name: "image-id",
        Values: allowedImageIds,
      },
    ],
    // MaxResults: '10',
  };

  try {
    const data = await ec2client.describeInstances(params).promise();
    if (data.Reservations.length > 0) {
      return data.Reservations.map((res) => res.Instances).flat();
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    // console.dir('DONE: getInstances');
  }
};

export const createInstance = async (ec2client, request) => {
  if (!ec2client) return null;
  if (!request) return null;
  var instanceParams = {
    ImageId: request.ami.ImageId,
    InstanceType: "m5ad.4xlarge", //"r5ad.2xlarge",
    KeyName: request.keypair.KeyName,
    SecurityGroupIds: [request.securitygroup.GroupId],
    MinCount: 1,
    MaxCount: 1,
    BlockDeviceMappings: [
      {
        DeviceName: "/dev/sda1",
        Ebs: {
          DeleteOnTermination: true,
          VolumeSize: 150,
          VolumeType: "gp2",
        },
      },
      // {
      //   DeviceName: "xvdh",
      //   Ebs: {
      //     DeleteOnTermination: true,
      //     VolumeSize: 100,
      //     VolumeType: "gp2",
      //   },
      // },
      {
        DeviceName: "/dev/sdb",
        VirtualName: "ephemeral0",
      },
    ],
    TagSpecifications: [
      {
        ResourceType: "instance",
        Tags: [
          {
            Key: "Name",
            Value: request.name,
          },
        ],
      },
    ],
  };

  try {
    const data = await ec2client.runInstances(instanceParams).promise();
    return data.Instances[0];
  } catch (error) {
    console.dir(error);
    return null;
  } finally {
    // console.dir('DONE: createInstance');
  }
};

export const waitForInstanceOk = async (ec2client, request) => {
  if (!ec2client) return null;
  if (!request) return null;
  var params = {
    InstanceIds: [request.InstanceId],
  };
  try {
    const data = await ec2client.waitFor("instanceStatusOk", params).promise();
    if (data?.InstanceStatuses.length > 0) {
      return await getInstance(ec2client, request.InstanceId); // return the instance details
    }
  } catch (error) {
    console.dir(error);
    return null;
  } finally {
    // console.dir('DONE: waitForInstanceOk');
  }
};

export const getInstanceName = (instance) =>
  (instance.Tags.find((t) => t.Key === "Name") || { Value: "none" }).Value;
