# To run
```
sails lift

## API Server Set Up
## Nodejs and npm version update
Prerequisite CHECK NPM & NODE.JS VERSION IN YOUR SYSTEM.\
The default node.js and npm installed in Ubuntu 18.04 LTS unable to perform the installation process.\
It is essential to update your machine's npm and node.js to the latest version in order for the rest of the part to work.\
[This link](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04) will walkthrough you the steps for updating your npm and node.js to the latest version. 

## NPM proxy confiration
**Running npm in Intel requires proxy** to download the necessary package that npm is going to download later.\
Run the following commands which will set the http and https proxy settings in npm.

## ROS2-Eloquent set-up
Follow [This link](https://index.ros.org/doc/ros2/Installation/Eloquent/Linux-Install-Debians/) to install ROS2-Eloquent.\
Prefer **ros-eloquent-desktop** currently.\
Source the environment
```
source /opt/ros/eloquent/setup.bash
```
## Sails set-up
Use the following command to install Sails.
```
npm install sails -g
