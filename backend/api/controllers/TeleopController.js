/**
 * TeleopController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

'use strict';

module.exports = {
    initTeleop: function(req,res){
        var robot_to_connect = req.query.robotname;
        if (robot_to_connect===''){
            res.json({success: false});
        }
        var topic_name = robot_to_connect + '/cmd_vel';
        global.teleop_publisher = teleop_node.createPublisher('geometry_msgs/msg/Twist', topic_name);
        
        return res.send("Publisher created");
    },

    stopTeleop: function(req,res){
        teleop_node.destroyPublisher(teleop_publisher);
        return res.send("Publisher destroyed");
        // return res.json({
        //     message: robot_to_connect + ' publisher destroyed!'
        // })
    },

    up: function(req, res){
        var desiredSpeed = req.query.speed;
        if (desiredSpeed === undefined){
            desiredSpeed = 0.1;
        }
        var twist = {
            linear:{
                x:desiredSpeed,
                y:0.0,
                z:0.0
            },
            angular:{
                x:0.0,
                y:0.0,
                z:0.0
            }
        }
        teleop_publisher.publish(twist);
        res.send("UP pressed!");
    },

    down: function(req, res){
        var desiredSpeed = req.query.speed;
        if (desiredSpeed === undefined){
            desiredSpeed = 0.1;
        }
        var twist = {
            linear:{
                x:-desiredSpeed,
                y:0.0,
                z:0.0
            },
            angular:{
                x:0.0,
                y:0.0,
                z:0.0
            }
        }
        teleop_publisher.publish(twist);
        res.send("DOWN pressed!");
    },

    left: async function(req, res){
        var desiredSpeed = req.query.speed;
        if (desiredSpeed === undefined){
            desiredSpeed = 0.1;
        }
        var twist = {
            linear:{
                x:0.0,
                y:0.0,
                z:0.0
            },
            angular:{
                x:0.0,
                y:0.0,
                z:desiredSpeed
            }
        }
        teleop_publisher.publish(twist);
        res.send("LEFT pressed!");
    },

    right: async function(req, res){
        var desiredSpeed = req.query.speed;
        if (desiredSpeed === undefined){
            desiredSpeed = 0.1;
        }
        var twist = {
            linear:{
                x:0.0,
                y:0.0,
                z:0.0
            },
            angular:{
                x:0.0,
                y:0.0,
                z:-desiredSpeed
            }
        }
        teleop_publisher.publish(twist);
        res.send("RIGHT pressed!");
    },

    stop: function(req, res){
        var twist = {
            linear:{
                x:0.0,
                y:0.0,
                z:0.0
            },
            angular:{
                x:0.0,
                y:0.0,
                z:0.0
            }
        }
        teleop_publisher.publish(twist);
        res.send("STOP pressed!");
    }
};

