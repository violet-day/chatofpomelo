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

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});


var restify = require('restify');

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();

server.get('/hello/:name', function (req, res) {
  res.send({message: 'hello ' + req.params.name});
});


server.post('/push', function (req, res) {
  var service=app.getServersByType('push')[0];


  console.log(pomelo.app);

  service.pushRemote.pushByUids(req.params.uids, req.params.route, req.params.msg, function (err, result) {
    if (err) {
      console.log(err);
      res.send(err);
      return;
    } else {
      res.send(result);
    }
  })
});
server.use(restify.CORS());
server.listen(8000, function () {
  console.log('%s listening at %s', server.name, server.url);
});