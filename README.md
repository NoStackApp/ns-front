ns-front
========
The ns-front CLI provides tools for front end developers building NoStack applications.  Currently, the tool offers only one tool: a test of an app to see whether the code conforms to the [NoStack Front End Guidelines](https://bit.ly/nsFrontEndRules).

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ns-front.svg)](https://npmjs.org/package/ns-front)
[![Downloads/week](https://img.shields.io/npm/dw/ns-front.svg)](https://npmjs.org/package/ns-front)
[![License](https://img.shields.io/npm/l/ns-front.svg)](https://github.com/https://github.com/NoStackApp/ns-front/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g ns-front
$ nsfront COMMAND
running command...
$ nsfront (-v|--version|version)
ns-front/0.0.3 linux-x64 node-v14.6.0
$ nsfront --help [COMMAND]
USAGE
  $ nsfront COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`nsfront help [COMMAND]`](#nsfront-help-command)
* [`nsfront test`](#nsfront-test)

## `nsfront help [COMMAND]`

display help for nsfront

```
USAGE
  $ nsfront help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `nsfront test`

The 'test' command lets you confirm that your code is not violating any of

```
USAGE
  $ nsfront test

OPTIONS
  -a, --appDir=appDir  application directory
  -h, --help           show CLI help

DESCRIPTION
  The 'test' command lets you confirm that your code is not violating any of
  the rules for testing required by nostack.  For documentation about those
  rules, please see https://bit.ly/nsFrontEndRules.  This is actually one of the tests
  conducted by NoStack to gauge the quality of submitted code.  Essentially, the
  test generates a new version of the code and then simply compares it against
  your current version.  If there are differences, then there is a problem with
  your code.

EXAMPLE
  $ nsfront test -a ~/temp/myApp
```

_See code: [src/commands/test.ts](https://github.com/NoStackApp/ns-front/blob/v0.0.3/src/commands/test.ts)_
<!-- commandsstop -->
