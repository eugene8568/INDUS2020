// global rclnodejs declaration //

const rclnodejs = require('rclnodejs');

async function rclnodeInit() {
  sails.log("Rclnodejs module initialization");
  return await rclnodejs.init();
}

function nodeInit(node_name){
  sails.log(node_name, 'created!');
  return rclnodejs.createNode(node_name);
}

async function nodeSpin(node_name){
  // sails.log(node_name,'spin!');
  return await rclnodejs.spin(node_name);
}

module.exports.rclnode = {

  // Global rclnodejs function
  instance: rclnodejs,
  init: rclnodeInit,
  createNode: nodeInit,
  spinNode: nodeSpin,
  
  // Global name 
  job_node: 'job_publisher_node',

};
