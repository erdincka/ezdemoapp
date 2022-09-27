const AWS = require("aws-sdk");

const AmiParams = {
  Filters: [
    {
      Name: "name",
      Values: [
        "ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-20220914",
        "RHEL-8.6.0_HVM-20220503-x86_64*",
      ],
    },
    {
      Name: "state",
      Values: ["available"],
    },
  ],
  Owners: [
    "099720109477", // Amazon - Canonical
    "309956199498", // Redhat
  ],
};

export const configureClient = (accessKeyId, secretAccessKey, region) => {
  AWS.config.update({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
  const client = new AWS.EC2({ apiVersion: "2016-11-15" });
  return client;
};

export const getAMIs = async (ec2client) => {
  try {
    const data = await ec2client.describeImages(AmiParams).promise();
    return data.Images;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    // console.dir('DONE: getAMIs');
  }
};

export const getRegions = async (ec2client) => {
  try {
    const data = await ec2client.describeRegions({}).promise();
    return data.Regions;
  } catch (error) {
    console.dir(error);
    return null;
  } finally {
    // console.dir('DONE: getRegions');
  }
};

export const getKeyPairs = async (ec2client) => {
  var params = {
    IncludePublicKey: true,
  };
  try {
    const data = await ec2client.describeKeyPairs(params).promise();
    return data.KeyPairs;
  } catch (error) {
    console.dir(error);
    return null;
  } finally {
    // console.dir('DONE: getKeyPairs');
  }
};

export const getSecurityGroups = async (ec2client) => {
  try {
    const data = await ec2client.describeSecurityGroups({}).promise();
    return data.SecurityGroups;
  } catch (error) {
    console.dir(error);
    return null;
  } finally {
    // console.dir('DONE: getSecurityGroups');
  }
};

export const getInstances = async (ec2client) => {
  const allowedImageIds = (await getAMIs(ec2client)).map((ami) => ami.ImageId);
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
    console.dir(error);
    return null;
  } finally {
    // console.dir('DONE: getInstances');
  }
};

export const createInstance = async (ec2client, request) => {
  var instanceParams = {
    ImageId: request.ami.ImageId,
    InstanceType: "t2.micro",
    KeyName: request.keypair.KeyName,
    SecurityGroups: [request.securitygroup.GroupName],
    MinCount: 1,
    MaxCount: 1,
    BlockDeviceMappings: [
      {
        DeviceName: "/dev/sda1",
        Ebs: {
          DeleteOnTermination: true,
          VolumeSize: 120,
          VolumeType: "gp2",
        },
      },
      {
        DeviceName: "xvdh",
        Ebs: {
          DeleteOnTermination: true,
          VolumeSize: 10,
          VolumeType: "gp2",
        },
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
