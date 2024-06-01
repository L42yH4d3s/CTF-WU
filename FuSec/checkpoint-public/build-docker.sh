#!/bin/bash
docker build --tag=ws .
docker run -p 81:80 -p 8088:8080 --rm --name=ws -it ws