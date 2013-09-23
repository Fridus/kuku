var winston = require('winston'),
    exec = require('child_process').exec,
    path = require('path'),
    fs = require('fs'),

    forever = require('forever'),
    async = require('async'),
    
    manager = require('./apps-manager');


var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({colorize: true})
  ]
});

var _errorLog = function(err) {
  logger.error(err);
}

var _execCommand = function(command, options, cb) {
  if( typeof options == 'function' ) {
    cb = options;
  }
  if(typeof options != 'object') {
    options = {};
  }

  var _command =  exec(command, options, function (err, stdout, stderr) {
    logger.info('Exec: ' + command);
    logger.info('stdout: ' + stdout);
    if(stderr.length) {
      logger.error('stderr: ' + stderr);
    }
    if (err !== null) {
      if(cb){
        return cb(err)
      }
      logger.error('exec error: ' + err);
    }
    if(cb) cb(null);
  });
};

var _getEnvironmentVariables = function(appPath, cb) {
  var envFile = path.join(path.dirname(appPath), '.env');

  fs.exists(envFile, function(exists){
    if(exists) {
      fs.readFile(envFile, {encoding: 'utf-8'}, function(err, data){
        var _variables = data.split('\n');

        return cb(_variables.join(' '));
        return cb('');
     });
    } else {
      return cb('');
    }
  });
};

var startApp = function(appPath) {
  async.waterfall([
    function(cb){
      manager.exists(appPath, function(err, exists, port){
        if(err) return cb(err);

        cb(null, exists, port);
      });
    },
    function(exists, port, cb){
      if(!exists) {
        manager.add(appPath, function(err, port){
          if(err) return cb(err);
          logger.info('App was added successfully !');
          cb(null, port);
        });
      } else {
        cb(null, port);
      }
    }
  ], function (err, port) {
    if(err) return _errorLog(err);

    // Start
    _getEnvironmentVariables(appPath, function(_env){
      _execCommand('PORT=' + port + (_env.length ? ' ' + _env : '') + ' ./node_modules/forever/bin/forever start ' + appPath, function(err){
        if(err) return _errorLog(err);

        logger.info('App was started on port '+port);
      });
    });
  });
};

var stopApp = function(appPath) {
  _execCommand('./node_modules/forever/bin/forever stop ' + appPath, function(err){
    if(err) return _errorLog(err);
    listApps();
  });
}

var stopAll = function() {
  _execCommand('./node_modules/forever/bin/forever stopall', function(err){
    if(err) return _errorLog(err);
    listApps();
  });
}


var restartApp = function(appPath) {
  stopApp(appPath);
  setTimeout(function(){
    startApp(appPath);
  }, 1000);
}

var listApps = function() {
  _execCommand('./node_modules/forever/bin/forever list', function(err){
    if(err) return _errorLog(err);
  });
}

var removeApp = function(appPath) {
  manager.remove(appPath, function(err){
    if(err) return _errorLog(err);
  })
}

var listAppsInConfig = function() {
  manager.list(function(err, apps){
    if(err) return _errorLog(err);
    apps.forEach(function(_app, i){
      logger.info('Index: ['+i+']\n\tPath: '+_app.path+'\n\tPort: '+_app.port+'\n');
    });
  });
}

module.exports = {
  start: startApp,
  stop: stopApp,
  stopAll: stopAll,
  restart: restartApp,
  list: listApps,
  remove: removeApp,
  listapps: listAppsInConfig
};
