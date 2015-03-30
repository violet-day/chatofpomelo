module.exports = function (app) {
  return new Handler(app);
};

var Handler = function (app) {
  this.app = app;
};

var handler = Handler.prototype;

/**
 * New client entry chat server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
handler.enter = function (msg, session, next) {
  var self = this,
    uid = msg.uid;

  var sessionService = self.app.get('sessionService');

  //duplicate log in
  if (!!sessionService.getByUid(uid)) {
    next(null, {
      code: 500,
      error: true
    });
    return;
  }

  session.bind(uid);
  session.pushAll(function (err) {
    if (err) {
      next(err);
    } else {
      console.log('uid:%s,sid:%s has connected to %s', uid, session.id, session.frontendId);
      next(null, {
        sid: session.id,
        uid: msg.uid
      });
    }
  });
  session.on('closed', function () {
    console.log('uid:%s,sid:%s has left to %s', session.uid, session.id, session.frontendId);
  });
};