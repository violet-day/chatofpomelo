var assert = require('assert');

module.exports = function (app) {
  return new Handler(app);
};
/**
 *
 * @param app
 * @constructor
 */
var Handler = function (app) {
  this.app = app;
  this.channelService = app.get('channelService');
  this.statusService = this.app.get('statusService');
  this.globalChannel = this.app.get('globalChannelService');
};

var handler = Handler.prototype;

handler.hello = function (msg, seesion, next) {
  next(null, {
    route: msg.route,
    response: 'hello ' + msg.uid
  });
};

handler.pushByUids = function (msg, session, next) {

  this.app.rpc.push.pushRemote.pushByUids(msg.uids, msg.route, msg.message, next);
};

handler.doRpc = function (msg, session, args, next) {
  var service = this.app.rpc[msg.serviceName];
  assert(service, 'service ' + msg.serviceName + ' not found');
  var remote = service[msg.serviceName + 'Remote'];
  assert(remote, msg.serviceName + 'Remote not found');
  var method = remote[msg.methodName];
  assert(method, msg.methodName + ' not found');
  assert(args && typeof args === 'array', 'args must be an array');
  if (next) {
    args = args.concat(next);
  }
  method.apply(this, args);
};

/**
 *
 * @param msg
 * @param next
 */
handler.broadcast = function (msg, session, next) {
  this.globalChannel.pushMessage('connector', 'onMsg', msg, 'global', {}, function (err) {
    next(null, {
      route: msg.route
    });
  });
};


/**
 *
 * @param msg
 * @param session
 * @param next
 */
handler.pushByChannelId = function (msg, session, next) {
  var cid = msg.rid;
  console.log("---channel id:" + cid);
  this.app.rpc.push.pushRemote.pushByChannelId(cid, session.uid, cid, msg, next);
};

/**
 *
 * @param msg
 * @param next
 */
handler.pushByServerid = function (session, msg, next) {
  var sid = msg.sid;
  /*    this.globalChannel.getMembersBySid('*', sid, function (err, list) {
   var message = {
   client: list,
   msg: msg
   }
   this.pushByUids(session, msg, next);
   });*/
  this.app.rpc.push.pushRemote.pushByServerid.toServer(sid, msg, next);
};