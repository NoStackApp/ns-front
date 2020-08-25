ns-front
========

Tools for front end no stack developers

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
ns-front/0.0.0 linux-x64 node-v14.6.0
$ nsfront --help [COMMAND]
USAGE
  $ nsfront COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`nsfront hello [FILE]`](#nsfront-hello-file)
* [`nsfront help [COMMAND]`](#nsfront-help-command)

## `nsfront hello [FILE]`

describe the command here

```
USAGE
  $ nsfront hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ nsfront hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/NoStackApp/ns-front/blob/v0.0.0/src/commands/hello.ts)_

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
<!-- commandsstop -->
