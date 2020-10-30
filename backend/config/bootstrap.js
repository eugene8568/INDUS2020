/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function(cb) {

  await sails.config.rclnode.init();
  const server_sub_node = sails.config.rclnode.createNode('server_subscription_node');
  global.teleop_node = sails.config.rclnode.createNode('teleop_node');

  server_sub_node.createSubscription('std_msgs/msg/String', 'job', msg => {
    // console.log(msg);
    var jobMsg= JSON.parse((Object.values(msg)));
    var statusCode = jobMsg.status;
    // var amr_id = jobMsg.selected_amr;
    // var amr_name = jobMsg.robot_name;

    if (statusCode!=1){
      jobStatusUpdate(msg);
      sails.log.info('Job ID: ',jobMsg.job_id,' Status: ',jobMsg.status);
    }else{
      sails.log.info('Job created from UI! Publish to /job topic now');
    }
    // console.log(msg);
  });

  sails.config.rclnode.spinNode(server_sub_node);

  return cb();

};
