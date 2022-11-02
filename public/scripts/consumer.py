#!/usr/bin/python3

from confluent_kafka import Consumer, KafkaError
import signal

# Handle CTRL-C to close connections
def handler(signum, frame):
    print("Closing connections")
    # close the consumer
    c.close()
    # close the OJAI connection
    connection.close()
    print("{} messages processed".format(index))
    exit(0)
signal.signal(signal.SIGINT, handler)

from mapr.ojai.storage.ConnectionFactory import ConnectionFactory
import json
import os

### CONFIGURE
from settings import *

# Create a connection to the table via OJAI
connection_str = "{}:5678?auth=basic;user=mapr;password=mapr;" \
    "ssl=true;" \
    "sslCA=/opt/mapr/conf/ssl_truststore.pem;" \
    "sslTargetNameOverride={}".format(internal_hostname, internal_hostname)
connection = ConnectionFactory.get_connection(connection_str=connection_str)

# Get a store and assign it as a DocumentStore object
if connection.is_store_exists(table_name):
    store = connection.get_store(table_name)
else:
    store = connection.create_store(table_name)

def updateTable(json_dict):
    data = json.loads(json_dict)
    # Create new document from json_document
    new_document = connection.new_document(dictionary=data)
    # Print the OJAI Document
    print(new_document.as_json_str())

    # Insert the OJAI Document into the DocumentStore
    store.insert_or_replace(new_document)
    # create psudo file
    # os.system("hadoop fs -touchz myfiles/{}".format(data['file_path']))
    # this one is faster
    os.system("sudo -u mapr touch /mapr/{}/user/mapr/{}/{}".format(cluster_name, folder_name, data['file_path']))


# Subscribe to the topic
c = Consumer({'group.id': 'mygroup',
              'default.topic.config': {'auto.offset.reset': 'earliest'}})
c.subscribe(['/user/mapr/{}:{}'.format(stream_name, topic_name)])

index = 0
running = True
print('polling topic {} for messages'.format(topic_name))

while running:
  msg = c.poll(timeout=1.0)
  if msg is None: continue
  if not msg.error():
    data = msg.value().decode('utf-8')
    print('Received message: %s' % data)
    updateTable(data)
    index += 1
  elif msg.error().code() != KafkaError._PARTITION_EOF:
    print(msg.error())
    running = False
