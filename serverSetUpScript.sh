#!/bin/bash

#export http_proxy=http://proxy.png.intel.com:911
#export https_proxy=http://proxy.png.intel.com:911

cd ~
curl -sL https://deb.nodesource.com/setup_12.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh -y
#sudo -E apt install nodejs -y

npm config set proxy http://proxy.png.intel.com:911
npm config set https-proxy http://proxy.png.intel.com:911

sudo npm install sails -g
sudo npm install sails-mongo -g

wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo -E apt-get update
sudo -E apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

sudo locale-gen en_US en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8

sudo -E apt update && sudo -E apt install curl gnupg2 lsb-release
curl -s https://raw.githubusercontent.com/ros/rosdistro/master/ros.asc | sudo apt-key add -
sudo sh -c 'echo "deb [arch=$(dpkg --print-architecture)] http://packages.ros.org/ros2/ubuntu $(lsb_release -cs) main" > /etc/apt/sources.list.d/ros2-latest.list'

sudo -E apt update
sudo -E apt install ros-eloquent-ros-base -y
echo "source /opt/ros/eloquent/setup.bash" >> ~/.bashrc
source ~/.bashrc

sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
sudo -E apt update
sudo -E apt install ros-melodic-ros-base -y

