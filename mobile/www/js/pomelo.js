/**
 * Created by Nemo on 15/3/26.
 */
angular.module('pomelo', [])
  .constant('config', {
    gate: {
      host: '127.0.0.1',
      port: 3014,
      queryEntry: 'gate.gateHandler.queryEntry'
    },
    con: 1,
    log: true
  })
  .factory('pomeloUtil', function ($q, config) {
    var util = {};
    util.queryEntry = function (uid) {
      var deferred = $q.defer();
      pomelo.init({
        host: config.gate.host,
        port: config.gate.port,
        log: config.log
      }, function () {
        pomelo.request(config.gate.queryEntry, {
          uid: uid
        }, function (data) {
          pomelo.disconnect();
          if (data.code === 500) {
            deferred.reject(new Error(data));
          } else {
            pomelo.init(data, function () {
              pomelo.request('connector.entryHandler.enter',{uid:uid}, function (data) {
                if (data.error) {
                  deferred.reject(new Error(data.error));
                } else {
                  deferred.resolve(data);
                }
              })
            });
          }
        });
      });
      return deferred.promise;
    };
    return util;
  })