var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'chatofpomelo');
var status = require('pomelo-status-plugin');

// app configure
app.configure('production|development', function () {
  // route configures
  //app.route('chat', routeUtil.chat);

  // filter configures
  app.filter(pomelo.timeout());
});

app.use(status, {
  status: {
    host: '127.0.0.1',
    port: 6379
  }
});

app.configure('production|development', 'upstream', function () {
  app.set('connectorConfig',
    {
      connector: pomelo.connectors.hybridconnector
    }
  );
});

app.configure('production|development', 'upstream', function () {
  app.set('connectorConfig',
    {
      connector: pomelo.connectors.sioconnector
    }
  );
});


var httpPlugin = require('pomelo-http-plugin');
var path = require('path');
app.configure('development', 'gamehttp', function() {
  app.loadConfig('httpConfig', path.join(app.getBase(), 'config/http.json'));
  app.use(httpPlugin, {
    http: app.get('httpConfig')[app.getServerId()]
  });
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
