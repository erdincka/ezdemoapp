#!/usr/bin/python3

from confluent_kafka import Consumer, KafkaError
import signal

# Handle CTRL-C to close connections
def handler(signum, frame):
    print("Closing connections")
    # close the consumer
    c.close()
    print("{} messages processed".format(index))
    exit(0)
signal.signal(signal.SIGINT, handler)

from mapr.ojai.storage.ConnectionFactory import ConnectionFactory
import json
import os

### CONFIGURE
from settings import *

topic_name = "satellite"

# Subscribe to the topic
c = Consumer({'group.id': 'mygroup',
              'default.topic.config': {'auto.offset.reset': 'earliest'}})
c.subscribe(['/apps/hapi:{}'.format(topic_name)])

index = 0
duration = 60
delay = 1.0

print('polling topic {} for messages'.format(topic_name))

while index < (duration / delay):
  msg = c.poll(timeout=1.0)
  if msg is None: continue
  if not msg.error():
    data = msg.value().decode('utf-8')
    print('Received message: %s' % data)
    index += 1
  elif msg.error().code() != KafkaError._PARTITION_EOF:
    print(msg.error())
    break
