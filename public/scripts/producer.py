#!/usr/bin/python3

from confluent_kafka import Producer
from random import randint
from time import sleep
import datetime
import json
import signal

### CONFIGURE
from settings import *
topic_name = "random"

# Handle CTRL-C to close connections
def handler(signum, frame):
    print("FINISHED")
    print("Messages sent: {}".format(index))
    exit(0)
signal.signal(signal.SIGINT, handler)

p = Producer({'streams.producer.default.stream': stream_name})
index = 0
delay = 1
duration = 60

while index < (duration/delay):
     seq = str(randint(1000000,9999999))
     json_dict = {
          "_id" : seq,
          "title" : "Title {}".format(seq),
          "description" : "Description for document {}".format(seq),
          "document_date" : str(datetime.datetime.now()),
          "file_path" : "{}.bin".format(seq)
          }
     print('sending {}'.format(json_dict))
     p.produce(topic_name, json.dumps(json_dict).encode('utf-8'))
     p.flush()
     index += 1
     sleep(delay)

handler()
