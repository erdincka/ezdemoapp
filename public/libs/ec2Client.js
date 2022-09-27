const  { EC2Client } = require( "@aws-sdk/client-ec2");
// Create anAmazon EC2 service client object.
const ec2Client = (REGION) => new EC2Client({ region: REGION });
module.exports = { ec2Client };
