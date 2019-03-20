# Output Manager
Output manager that allows for level-based output.  By default, this outputs to the console, but it by no means is required to.

## The Fun Stuff
[![Build Status](https://secure.travis-ci.org/MaddHacker/output-manager.svg?branch=master)](http://travis-ci.org/MaddHacker/output-manager)

[![Code Climate](https://codeclimate.com/github/MaddHacker/output-manager/badges/gpa.svg)](https://codeclimate.com/github/MaddHacker/output-manager)

[![Issue Count](https://codeclimate.com/github/MaddHacker/output-manager/badges/issue_count.svg)](https://codeclimate.com/github/MaddHacker/output-manager)

[![Test Coverage](https://codeclimate.com/github/MaddHacker/output-manager/badges/coverage.svg)](https://codeclimate.com/github/MaddHacker/output-manager/coverage)

[![Dependency Status](https://david-dm.org/MaddHacker/output-manager/status.svg)](https://david-dm.org/MaddHacker/output-manager)

[![npm Version](https://badge.fury.io/js/output-manager.svg)](https://badge.fury.io/js/output-manager)

## Why *Another* Output/Logging tool?
Several npms utilize multiple dependencies, and lead to code bloat.  There are also several modules on the market that are very opinionated (e.g. force you to do certain things) or are focused on a single form of logging/output.  This tool aims to be a lightweight, flexible solution that allows for output to one or many sources as the user needs.

## Getting Started
- Install [the npm](https://www.npmjs.com/package/output-manager) in your project: `npm install --save output-manager`
- Require the library where needed: `const O = require('output-manager');`
- Output using one of several levels.  Each has a short and a long name.

# The LogLevels
As with most logging systems, there have been several levels defined to allow for grainular output.  In order from most verbose to least verbose, those are:
- `TRACE` => only used for those really hard problems and lots of information
- `DEBUG` => used to provide more development focused output
- `INFO` => used to provide information to the consumer of the output
- `WARN` => things might be going wrong...
- `ERROR` => things have gone wrong, but we're trying to stay up
- `FATAL` => it's all sideways, and this is the last bit of information before the process exits

Each of these levels are defined in the `O.LogLevels` enum.

Access to log levels is through a relevantly named function, of which there is a short and long name for.  These are:
- `TRACE` => uses `#t(msg)` or `#trace(msg)`
- `DEBUG` => uses `#d(msg)` or `#debug(msg)`
- `INFO` => uses `#i(msg)` or `#info(msg)`
- `WARN` => uses `#w(msg)` or `#warn(msg)`
- `ERROR` => uses `#e(msg)` or `#error(msg)`
- `FATAL` => uses `#f(msg)` or `#fatal(msg)`

## Setting the LogLevel
The LogLevel is dynamically set/adjusted as the application is running.  This allows any developer to write a hook to turn up logs in a running environment without restart or issue.  By default, the LogLevel is set to `INFO` but can easily be changed using the `#level(newLevel)` method.  An example of this is:
```
const O = require('output-manager');
O.d('Hi, I am debug'); // no output
O.level(O.LogLevel.DEBUG);
O.d('Hi, I am debug'); // outputs: Hi, I am debug
```

## Checking the LogLevel
The current LogLevel will be returned anytime `#atLevel()` is called.

# Message Formatting
The message format is currently set to `<ISODate> [<LEVEL>] <message>`.  The ISODate is the ISO formatted date that can be externally accessed via the `#date()` method.  This format uses the [standard set by ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) which effectively looks like:
```
yyyy-MM-ddTHH:mm:ss.SSSZ
2017-01-21T06:35:44.302Z
```
Note that the `T` always occurs between the date and the time.  The `Z` indicates UTC.

The `[<LEVEL>]` indicates the LogLevel the message was sent at.  This will always be 5 characters long, with whitespace added to the 4 character LogLevel names after the name, before the ending `]`.  This ensures consistent formatting when looking at logs in the console, or a file.

To put all of this together, here are some example outputs:
```
const O = require('output-manager');
O.level(O.LogLevel.TRACE);
O.t('Hi, I am trace'); // 2017-01-21T06:35:44.302Z [TRACE] Hi, I am trace
O.d('Hi, I am debug'); // 2017-01-21T06:35:44.402Z [DEBUG] Hi, I am debug
O.i('Hi, I am info');  // 2017-01-21T06:35:44.612Z [INFO ] Hi, I am info
O.w('Hi, I am warn');  // 2017-01-21T06:35:45.302Z [WARN ] Hi, I am warn
O.e('Hi, I am error'); // 2017-01-21T06:35:45.702Z [ERROR] Hi, I am error
O.f('Hi, I am fatal'); // 2017-01-21T06:35:46.311Z [FATAL] Hi, I am fatal
```

## Customizing Message Formatting
Message format can be customized by calling the `#setFmtString` function.  This function is passed two parameters (in order): `message {string}` and `level {LogLevel}`.  This can be formatted in any way desired, and then the result should be returned.  An example that just outputs the message is:
```
const O = require('output-manager');
O.setFmtString(function (msg, level) {
    return msg; // just output the message
});
```

# Controlling Output
Currently, the application defaults to using `process.stdout.write(msg + os.EOL)` for all output.  However, this may not be efficient, and is almost impossible to test.  The output is controlled through an internal `__logger` function, which can be set using the `#setLogger(function(logMsg){})`.  This logger is called after 2 things have happened:
- The message has been determined to be at a level that needs to be output
- The message has been formatted as described in Message Formatting
To override the default `__logger` you can do something like:
```
const O = require('output-manager');
O.setLogger(function(logMsg) {
    console.log(logMsg);
    // add file
    // add stream
});
```
This control means that the output can be sent to the console, as well as to a websocket, or a file.

*NOTE: It is the goal to start to build some of this functionality into the module*

# All Output
Before the `LogLevel` is checked, the message and it's `LogLevel` go through the `__doLog` function.  This can be overridden by calling the `#setDoLog()` and setting the function that should be used.  This can be overridden to absorb all output and stream it wherever is needed (as desired).  It is important to note that if you override this function you *MUST* call the `#getLogOutIfLevelAllows()` function.  An example override might look something like this:
```
const O = require('output-manager');
O.setDoLog(function (msg, level) {
    // do something fun
    O.getLogOutFxn()(msg, level);
});
```

# Dependencies and Why
- [string-utilz](https://www.npmjs.com/package/string-utilz)

This is used to manage strings and string formatting.  This is a super-lightweight framework that helps to minimize disruptions in your code.  Primarily used for formatting.

# Slack
This is one of several projects that are in the works, so feel free to reach out on [Slack](https://maddhacker.slack.com/).  Please email `slack at maddhacker dot com` for an invite.

# Issues
Please use the [Issues tab](../../issues) to report any problems or feature requests.

# Change Log
All change history can be found in the [CHANGELOG.md](CHANGELOG.md) file.
