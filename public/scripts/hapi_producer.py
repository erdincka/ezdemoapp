#!/usr/bin/python3

import signal

### CONFIGURE
from settings import *
table_name = "satellite"
topic_name = "satellite"

# Handle CTRL-C to close connections
def handler(signum, frame):
    print("FINISHED")
    print("Messages sent: {}".format(index))
    exit(0)
signal.signal(signal.SIGINT, handler)

# Get Dst index from CDAWeb HAPI server
import json
import os
from hapiclient import hapi, hapitime2datetime
from datetime import timedelta
from time import sleep

# Kafka Producer for event streams
from confluent_kafka import Producer

p = Producer({'streams.producer.default.stream': '/apps/demo/hapi'})

# Timeformat helpers
def datetime2hapitime(time):
    return (time).isoformat().replace("+00:00", "Z")


def getnextday(hapitime):
    return (hapitime2datetime(hapitime) + timedelta(days=1))[0]

def notification_from_metadata(meta):
    # Metadata example
    #   "x_metaFileParsed": "/mapr/demo.df.io/data/hapi-data/vires.services_hapi/CS_OPER_MAG___.pkl",
    #   "x_dataFileParsed": "/mapr/demo.df.io/data/hapi-data/vires.services_hapi/CS_OPER_MAG__20110411T170326254000_20110412T170326254000.npy",
    #   "x_metaFile": "/mapr/demo.df.io/data/hapi-data/vires.services_hapi/CS_OPER_MAG___.json",
    #   "x_dataFile": "/mapr/demo.df.io/data/hapi-data/vires.services_hapi/CS_OPER_MAG__20110411T170326254000_20110412T170326254000.bin",
    return dict(
        timestamp=meta["x_time.max"],
        metapath=meta["x_metaFileParsed"],
        datapath=meta["x_dataFileParsed"],
    )


# Data will be saved in Data Fabric using Fuse (filesystem)
DFROOT = "/apps/demo/hapi"
CACHEDIR = os.path.join(
    DFROOT, "satellite-data"
)

# Hapi client settings
server = "https://vires.services/hapi"
dataset = "CS_OPER_MAG"
start = "2011-04-08T17:03:26.254Z"
stop = datetime2hapitime(getnextday(start))
parameters = ""  # 'Latitude,Longitude'
opts = {"logging": True, "cachedir": CACHEDIR}

# Configure DB client
from mapr.ojai.storage.ConnectionFactory import ConnectionFactory

connection_str = (
    "{}:5678?auth=basic;user=mapr;password={};"
    "ssl=true;"
    "sslCA=/opt/mapr/conf/ssl_truststore.pem;"
    "sslTargetNameOverride={}".format(internal_hostname, admin_password, internal_hostname)
)
connection = ConnectionFactory.get_connection(connection_str=connection_str)
if connection.is_store_exists(table_name):
    store = connection.get_store(table_name)
else:
    store = connection.create_store(table_name)

# Get data
index = 0
delay = 3
iteration = 20

while index < iteration:

    data, meta = hapi(server, dataset, parameters, start, stop, **opts)

    # Push metadata into DF event streams
    if meta["status"]["code"] == 1200:
        ## send notification to Event Stream
        cleaned = notification_from_metadata(meta)
        p.produce(topic_name, json.dumps(cleaned).encode("utf-8"))
        p.flush()

        ## send metadata to table
        meta["_id"]=index
        packed = json.dumps(meta)
        new_document = connection.new_document(json_string=packed)
        store.insert_or_replace(new_document)

    # Plot all parameters
    # from hapiplot import hapiplot
    # hapiplot(data, meta)

    # continue with next day
    start = stop
    stop = datetime2hapitime(getnextday(start))
    # repeat after a delay
    index += 1
    sleep(delay)

connection.close()
print("FINISHED")
