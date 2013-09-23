
var fs = require('fs');

var config = __dirname + '/../config/list.json',
    defaultPort = 10000;

var getList = function(cb) {
  fs.exists(config, function (exists) {
    if(!exists) {
      // No apps
      return cb(null, []);
    }
    fs.readFile(config, function(err, data){
      if(err) {
        return cb(err);
      }
      try {
        data = JSON.parse(data);
      } catch (err) {
        return cb(err);
      }
      cb(null, data);
    });
  });
}

var _getNewPort = function(cb) {
  getList(function(err, data){
    if(err) return cb(err);

    var ports = data.map(function(_app) {
      return _app.port;
    });

    var maxPort = Math.max.apply(Math, ports);

    if(maxPort >= defaultPort) {
      return cb(null, maxPort+1);
    }
    return cb(null, defaultPort);
  });
}

var exists = function(appPath, cb) {
  getList(function(err, data){
    if(err) {
      return cb(err);
    }
    for(var i = 0; i< data.length; i++) {
      var app = data[i];
      if(app.path == appPath) {
        return cb(null, true, app.port);
      }
    }
    cb(null, false);
  });
}

var add = function(appPath, cb) {
  getList(function(err, data){
    if(err) return cb(err);

    _getNewPort(function(err, port){
      if(err) return cb(err);

      data.push({
        path: appPath,
        port: port
      });

      fs.writeFile(config, JSON.stringify(data), function(err){
        if (err) {
          cb(err);
          return;
        }
        cb(null, port);
      });
    });
  });
}

var remove = function(appPath, cb) {
  getList(function(err, data){
    if(err) return cb(err);

    var position;

    if(!isNaN(parseInt(appPath))){
      position = appPath;
    } else {
      var paths = data.map(function(_app){return _app.path;});
      position = paths.indexOf(appPath);
    }

    if(position != -1) {
      data.splice(position, 1);
      fs.writeFile(config, JSON.stringify(data), function(err){
        if (err)  return cb(err);
        return cb(null);
      });
    } else {
      cb(appPath + ' does not exist in config');
    }
  });
}

module.exports = {
  exists: exists,
  add: add,
  remove: remove,
  list: getList
};
