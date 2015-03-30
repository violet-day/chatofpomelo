/**
 * Created by Nemo on 15/3/30.
 */
module.exports= function (app,opt) {
  return new HelloWorld()
};

var DEFAULT_INTERVAL = 3000;

var HelloWorld = function(app, opts) {
  this.app = app;
  this.interval = opts.interval | DEFAULT_INTERVAL;
  this.timerId = null;
};

HelloWorld.name = '__HelloWorld__';

HelloWorld.prototype.start = function(cb) {
  console.log('Hello World Start');
  var self = this;
  this.timerId = setInterval(function() {
    console.log(self.app.getServerId() + ": Hello World!");
  }, this.interval);
  process.nextTick(cb);
}

HelloWorld.prototype.afterStart = function (cb) {
  console.log('Hello World afterStart');
  process.nextTick(cb);
}

HelloWorld.prototype.stop = function(force, cb) {
  console.log('Hello World stop');
  clearInterval(this.timerId);
  process.nextTick(cb);
}