#!/bin/bash

docker run -it --rm \
    --hostname rabbit-server \
    --name rabbit-server \
    -e RABBITMQ_DEFAULT_USER=user \
    -e RABBITMQ_DEFAULT_PASS=password \
    -e RABBITMQ_DEFAULT_VHOST=my_vhost \
    -p 15672:15672 \
    -p 5672:5672 \
    -p 15692:15692 \
    rabbitmq:3-management