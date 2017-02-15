#!/bin/bash

echo 
echo "Building react app"
npm run build

echo 
echo "Moving build folder to docker directory"
cp -R ./build ./docker/server
cd docker

echo
echo "Removing raaserver docker container if present"
docker rm -f raaserver

echo 
echo "Building and starting raaserver docker container"
docker-compose up --build -d