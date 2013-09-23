#kuku
A simple CLI tool for ensuring that a given script runs continuously. It use [forever](http://github.com/nodejitsu/forever).

##Usage
```
  Usage: kuku [options] [command]

  Commands:

    start [appPath]        Start App
    stop [appPath]         Stop App
    restart [appPath]      Restart App
    list                   List Apps running
    *

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

##Environment variables
Use file ".env" in your script's directory.

Example:
```
NODE_ENV=production
NUMBER=1234
```

##To do:
- Remove app
- Status of app
- Tests...
- Fix: Error if file list.json is empty


#### Author: [Florent Detry](http://github.com/fridus)
#### Copyright (c) 2013 Florent Detry.