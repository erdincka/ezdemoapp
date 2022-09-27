import AWSCredentials from "./AWSCredentials";

export const targets = [
  {
    "name": "ubuntuonaws",
    "title": "Ubuntu on AWS",
    "description": "Create Ubuntu 20.04 template for EDF on AWS",
    "credentials": AWSCredentials
  },
  {
    "name": "centos7onaws",
    "title": "CentOS7 on AWS",
    "description": "Create CentOS 7.9 template image for ERE on AWS",
  },
  {
    "name": "centos8onaws",
    "title": "CentOS8 on AWS",
    "description": "Create CentOS 8.5 template image on AWS",
  },
  {
    "name": "dfonubuntu",
    "title": "Single Node DF",
    "description": "Deploy a single node Data Fabric on Ubuntu 20.04",
  },
  {
    "name": "dfonubuntuha",
    "title": "5-Node DF",
    "description": "Deploy 5 node (HA) Data Fabric on Ubuntu 20.04"
  }
]