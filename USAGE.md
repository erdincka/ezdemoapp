# How to use Ezdemo App

Create and AWS instance and Install Data Fabric

Select Data Fabric on Home page

![Home](./images/01-home.jpg)

Select AWS as provider
![AWS](./images/02-aws-select.jpg)

Enter your credentials
![AWS Credentials](./images/03-aws-credentials.jpg)

Create a new instance (or select and existing one)
![EC2](./images/04-aws-create-instance.jpg)

Instance settings
![EC2 settings](./images/05-aws-create-instance-settings.jpg)

Wait for instance creation (~2 minutes)
![Wait for EC2](./images/06-aws-wait-instance.jpg)

Select instance to connect to
![Select EC2](./images/07-aws-select-instance.jpg)

Connect to the instance (provide your private key pem file)
![Connect to EC2](./images/08-aws-connect-instance.jpg)

Start DF installation
![Install DF](./images/09-server-installdf.jpg)

Cluster settings (can be left empty, cluster name defaults to "my.df.demo", admin password defaults to "mapr")
![DF Setup](./images/10-df-settings.jpg)

Wait for Data Fabric installation (~30 minutes)
![Wait DF](./images/11-df-wait-install.jpg)

Show script output (optional)
![Show Output](./images/12-show-output.jpg)

Monitor output
![Output](./images/13-output-view.jpg)

If "install started" then you can click "installing" next to spinner to connect to the installer and monitor the status
![Monitor Install](./images/14-monitor-install.jpg)

Install completed
![DF Installed](./images/15-df-installed.jpg)

Refresh clusters if not updated
![Cluster refresh](./images/16-clusters-refresh.jpg)

Configure cluster (client libraries and example scripts)
![Configure Cluster](./images/17-cluster-configure.jpg)

Click on cluster name and you will get links to component UI pages
![Run use case](./images/20-cluster-links.jpg)

Select a use case (UNDER DEVELOPMENT)
![Select use case](./images/18-usecase-select.jpg)

Run the use case (UNDER DEVELOPMENT)
![Run use case](./images/19-usecase-run.jpg)
