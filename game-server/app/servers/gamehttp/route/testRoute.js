/**
 * Created by Nemo on 15/3/27.
 */
module.exports = function (app, http) {

  http.get('/test', function (req, res) {
    var uids = ['nemo', 'jk'],
      route = 'onMsg',
      msg = {content: 'test'};
    app.rpc.push.pushRemote.pushByUids(null, uids, route, msg, function (err, result) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(result);
      }
    })
  });

  http.get('/hello/:name', function (req, res) {
    res.send({message: 'hello ' + req.params.name});
  });

  http.post('/push', function (req, res) {
    app.rpc.push.pushRemote.pushByUids(null, req.params.uids, req.params.route, req.params.msg, function (err, result) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(result);
      }
    })
  });
};