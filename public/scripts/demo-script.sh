# Login to mapr (generates ticket)
maprlogin password

# Check user home dir
hadoop fs -ls /user/mapr

# Create folder using hadoop
hadoop fs -mkdir /user/mapr/test

# Add file using posix/nfs
echo "1" > /mapr/core.df.io/user/mapr/test/file1

# Read file using hadoop
hadoop fs -cat /user/mapr/test/file

# Create /data/t1 using UI add some columns
# or using CLI
maprcli table create -path /data/t1 -tabletype binary 
maprcli table cf create -path /data/t1 -cfname details

# Connect via shell to check table
hbase shell
> put '/data/t1',1,'details:name','Ezmeral'
> put '/data/t1',1,'details:vendor','HPE'
> scan '/data/t1'

# Create JSON Table using CLI (t2)
maprcli table create -path /data/t2 -tabletype json
# permission settings for table
maprcli table cf edit -path /data/t2 -cfname default -readperm p -writeperm p -traverseperm  p
# Create stream for changelog
maprcli stream create -path /data/t2_changelog -ischangelog true -consumeperm p
# Add change log for t2 table to be published to a new topic
maprcli table changelog add -path /data/t2 -changelog /data/t2_changelog:t2_table

# copy the example data
hadoop fs -copyFromLocal all_docs.json /tmp/

# import existing all_docs.json into db
mapr importJSON -idField _id -src /tmp/*.json -dst /data/t2 -mapreduce false

mapr dbshell
> jsonoptions --pretty true --withtags false
> desc /data/t2
> find /data/t2 --limit 5

ls -l /mapr/df.garage.dubai/ 

