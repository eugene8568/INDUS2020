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
'use strict';

async function updateNotification(message,type,amrID){
  await Notification.create({
    'message':message,
    'type':type, 
    'owner':amrID
  })
}

function mapLocationRetrieval(sub_message){
  var mapSize = {
    'width':sub_message.info.width,
    'height':sub_message.info.height
  };
  var mapOrigin = {
    'x':(sub_message.info.origin.position.x).toFixed(4),
    'y':(sub_message.info.origin.position.y).toFixed(4)
  };
  var mapResolution = (sub_message.info.resolution).toFixed(2);
  
  var mapData = Array.from(sub_message.data);
  // var mapData = (Object.values(sub_message.data));

  // console.log('mapSize:', mapSize);
  // console.log('mapOrigin:', mapOrigin);
  // console.log('mapResolution:', mapResolution);
  // console.log('mapData:', Array.from(sub_message.data));

  var msg = {
    'mapID' : 0,
    'mapSize' : mapSize,
    'mapOrigin' : mapOrigin,
    'mapResolution' : mapResolution,
    'mapDataArray': mapData
  };
  // var updateMsg = {'$set': message};
  // console.log(MapData.count());
  MapData.count().exec(async function(err,sub_message){
    if (err){
      console.log(err);
    }
    if (sub_message === 0){
      // console.log('no message!');
      try{
        await MapData.create(msg);
      }
      catch (e){
        sails.log.error(e);
      }
    }
    else{
      try{
        await MapData.update({mapID:'0'})
        .set({
          'mapSize' : mapSize,
          'mapOrigin' : mapOrigin,
          'mapResolution' : mapResolution,
          'mapDataArray': mapData
        });
        // console.log('I got the message. Yay!');
      }
      catch(e){
        sails.log.error(e);
      }
    }
  });
}

async function jobStatusUpdate(message){
  // console.log(message);
  var jobMsg= JSON.parse((Object.values(message)));
  var status = jobMsg.status;
  var job_id = jobMsg.job_id;
  var amr_id = jobMsg.selected_amr;
  var amr_name = jobMsg.robot_name;
  var amr_IP = jobMsg.robot_IP;
  var bFirstTimeCreate = false;

  try{
    var checkResult = await AMR.findOne({'name':amr_name});
  }
  catch(e){
    console.log('checkResult:',checkResult);
  }
  if (checkResult === undefined){
    bFirstTimeCreate = true; // boolean check for AMR first time initialize
    try{
      await AMR.create({
        'name':amr_name,
        'macAddress':amr_id,
        'ipAddr':amr_IP
      });
    }
    catch(e){
      console.log("Error in create AMR:",e);
    }
  }

  // try{
  //   var amr_in_db = await AMR.findOne({'name':amr_name});
  // }
  // catch(e){
  //   console.log("Error in finding AMR:",e);
  // }
  var amr_id_to_update = checkResult.id;

  if (bFirstTimeCreate === true){
    var robotCreateMsg = amr_name + 'created';
    try{
      updateNotification(robotCreateMsg,'Info',amr_id_to_update);
    }
    catch(e){
      sails.log.debug("Problem in AMR first initialized notification:",e)
    }
  }

  if(status === 2){
    Job.findOne({id:jobMsg.job_id}).exec(async function(err, jobMsg){
      if (err){
        console.log(err);
      }

      // update Job.status
      try{
        await Job.updateOne({id:job_id})
        .set({
          'status':status,
          'owner':amr_id_to_update
        })
      }
      catch(e){
        sails.log(e);
      }

      // update Notification
      try{
        updateNotification('Job assigned, Status: 2','Info',amr_id_to_update);
      }
      catch(e){
        sails.log(e);
      }
      sails.log.info("Job status updated!");
    })
  }

  else if(status === 3 || status === 4){
    try{
      await Job.updateOne({id:job_id})
        .set({
          'status':status
        })
    }
    catch(e){
      sails.log(e);
    }
    
    // update Notification
    var jobStatusMsg = 'Job status updated:' + status.toString();
    try{
      updateNotification(jobStatusMsg,'Info',amr_id_to_update);
    }
    catch(e){
      sails.log(e);
    }
    sails.log.info("Job status updated!");
  }
}

async function statusUpdate(message){
  var msgJson= JSON.parse((Object.values(message)));
  var robotName = msgJson.robot_namespace;
  var msgType = msgJson.data_type;
  var msgParse = msgJson.data;

  var amr_db = await AMR.findOne({name:robotName});
  if (amr_db != undefined){
    var amr_id_update = amr_db.id;

    if (msgType === 'robot_position'){
      AMR.findOne({name:robotName}).exec(async function(err){
        if (err){
          sails.log('amrStatusUpdateError:', err);
        }
        var posUpdatedResult = await AMR.updateOne({name:robotName})
        .set({
          'location': msgParse
        })

        if(posUpdatedResult){
          AMR.publish([amr_id_update], {
            verb: 'updated',
            data: posUpdatedResult
          });
        }
      })
    }

    else if(msgType === 'robot_battery'){
      AMR.findOne({name:robotName}).exec(async function(err){
        if (err){
          sails.log('amrStatusUpdateError:', err);
        }
        var batteryUpdatedResult = await AMR.updateOne({name:robotName})
        .set({
          'battery': msgParse
        })

        if(batteryUpdatedResult){
          AMR.publish([amr_id_update], {
            verb: 'updated',
            data: batteryUpdatedResult
          });
        }
      })
    }

    else if(msgType === 'robot_status'){
      // console.log(msgParse);
      AMR.findOne({name:robotName}).exec(async function(err){
        if (err){
          sails.log('amrStatusUpdateError:', err);
        }
        try{
          var statusUpdatedResult = await AMR.updateOne({name:robotName})
          .set({
            'status': msgParse
          })
        }
        catch(e){
          sails.log.error("Problem in updating robot status:", e)
        }

        if(statusUpdatedResult){
          AMR.publish([amr_id_update], {
            verb: 'updated',
            data: statusUpdatedResult
          });
        }
      })

      // Notification update
      var message = "Robot_status: " + msgParse;
      try{
        updateNotification(message,'Info',amr_id_update);
      }
      catch(e){
        sails.log.info("Error in robot_status update", e);
      }
    }
  }
}

module.exports.bootstrap = async function(cb){
  
  await sails.config.rclnode.init();
  const job_node = sails.config.rclnode.createNode('server_job_publisher_node');
  const amr_ui_node = sails.config.rclnode.createNode('amr_ui_node');
  const server_sub_node = sails.config.rclnode.createNode('server_subscription_node');
  global.teleop_node = sails.config.rclnode.createNode('teleop_node');
  global.amr_subscriber_node = sails.config.rclnode.createNode('server_amr_subscriber_node');
  
  // Job model publisher
  global.job_publisher = job_node.createPublisher('std_msgs/msg/String', 'job');
  global.amrUI_publisher = amr_ui_node.createPublisher('std_msgs/msg/String', 'amrResponse');

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
  
  // topic update for map(multimap merge)
  server_sub_node.createSubscription('nav_msgs/msg/OccupancyGrid', 'robot1/map', msg => {
    // if there is no any map data available, the last map data retrieved will be display
    mapLocationRetrieval(msg);
  });

  // topic update for AMR location, battery & status
  server_sub_node.createSubscription('std_msgs/msg/String', 'status_update', msg => {
    statusUpdate(msg);
  });
  
  sails.config.rclnode.spinNode(server_sub_node);
  sails.config.rclnode.spinNode(amr_subscriber_node);
  // amrLocationPub();
  return cb();
};
