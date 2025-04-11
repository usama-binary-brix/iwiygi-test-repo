#!/bin/bash

# Verify Node.js version
echo 'Current node version is following:'
node -v

#give permission for everything in the express-app directory
sudo chmod -R 777 /home/ubuntu/iwantit


#navigate into our working directory where we have all our github files
cd /home/ubuntu/iwantit
sudo npm cache clean --force 
sudo rm -r node_modules
sudo npm install
sudo npm run build
