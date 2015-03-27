var assert = require('assert');

module.exports = function (app) {
  return new PushRemote(app);
};

var PushRemote = function (app) {
  this.app = app;
  this.channelService = app.get('channelService');
  this.statusService = this.app.get('statusService');
};


PushRemote.prototype.pushByUids = function ( uids, route, msg, callback) {
  assert(typeof msg === 'object', 'msg must be an object');
  assert(uids || typeof uids === 'array', 'uid must be an array');
  assert(route, 'msg.route must be provided');

  this.statusService.pushByUids(uids, route, msg, function (err) {
    if (err) {
      callback(err);
    } else {
      console.log('push to %s,message:%j,route:%s', uids, msg, route);
      callback(null, {
        route: route
      });
    }
  });
};

/**
 * Add user into chat channel.
 *
 * @param {String} uid unique id for user
 * @param {String} sid server id
 * @param {String} name channel name
 * @param {boolean} flag channel parameter
 *
 */
PushRemote.prototype.add = function (uid, sid, name, flag, cb) {
  var channel = this.channelService.getChannel(name, flag);
  var username = uid.split('*')[0];
  var param = {
    route: 'onAdd',
    user: username
  };
  channel.pushMessage(param);

  if (!!channel) {
    channel.add(uid, sid);
  }

  cb(this.get(name, flag));
};

/**
 * Get user from chat channel.
 *
 * @param {Object} opts parameters for request
 * @param {String} name channel name
 * @param {boolean} flag channel parameter
 * @return {Array} users uids in channel
 *
 */
PushRemote.prototype.get = function (name, flag) {
  var users = [];
  var channel = this.channelService.getChannel(name, flag);
  if (!!channel) {
    users = channel.getMembers();
  }
  for (var i = 0; i < users.length; i++) {
    users[i] = users[i].split('*')[0];
  }
  return users;
};

/**
 * Kick user out chat channel.
 *
 * @param {String} uid unique id for user
 * @param {String} sid server id
 * @param {String} name channel name
 *
 */
PushRemote.prototype.kick = function (uid, sid, name, cb) {
  var channel = this.channelService.getChannel(name, false);
  // leave channel
  if (!!channel) {
    channel.leave(uid, sid);
  }
  var username = uid.split('*')[0];
  var param = {
    route: 'onLeave',
    user: username
  };
  channel.pushMessage(param);
  cb();
};
