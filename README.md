# kuku

A simple CLI tool for ensuring that a given script runs continuously. It use [forever](http://github.com/nodejitsu/forever).

## Usage
```
  Usage: kuku [options] [command]

  Commands:

    start [path]           Start App
    stop [path]            Stop App
    stopall                Stop all running scripts
    restart [path]         Restart App
    list                   List Apps running
    listapps               List Apps in config
    remove [path|index]    Remove an app of config
    *

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

## Environment variables
Use file ".env" in your script's directory.

Example:
```bash
NODE_ENV=production
NUMBER=1234
```

## To do:
- Status of app
- Tests...


#### Author: [Florent Detry](http://github.com/fridus)
#### Copyright (c) 2013 Florent Detry.