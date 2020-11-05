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
  const indus_ui_node = sails.config.rclnode.createNode('indus_ui_node');
  global.teleop_node = sails.config.rclnode.createNode('teleop_node');

  global.indus_publisher = indus_ui_node.createPublisher('std_msgs/msg/String', 'indus');

  server_sub_node.createSubscription('std_msgs/msg/String', 'indus', msg => {
    console.log(' msg ',msg);
    msg= "heelooooooo"
    // var jobMsg= JSON.parse((Object.values(msg)));
    // var statusCode = jobMsg.status;
    // var amr_id = jobMsg.selected_amr;
    // var amr_name = jobMsg.robot_name;
  });

  sails.config.rclnode.spinNode(server_sub_node);

  return cb();

};
