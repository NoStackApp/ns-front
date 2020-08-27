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
ns-front/0.0.6 linux-x64 node-v14.6.0
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

_See code: [src/commands/test.ts](https://github.com/NoStackApp/ns-front/blob/v0.0.6/src/commands/test.ts)_
<!-- commandsstop -->

### Working with Test Results
The diff files in `<appPath>.test/diffs` show a number of problems.  If you understand what's happening, the solutions are usually straightforward, but it may seem confusing at first. 

It helps to understand clearly that your code files in `<appPath>/src/components` are being compared to generated versions in `<appPath>.test/src/components`.  You may want to learn the basics of `diff` outputs if you haven't already.

The problems (and their likely causes and solutions) are shown below.  They can be one of the following:
1. There are lines in the generated test code that do not appear in yours.  That would indicate that you removed some code, or that something in the version of your ns-front is more uptodate than the version used to generate your code.  The solution is to add those lines to your code in the line number indicated, and then to try the test again.
2. Your code has lines not in the generated code.  That usually indicates that you added code in places not permitted in the code.  You need to insert all of your custom code in ns-custom areas, or to replace a section of the generated code using the "replacement" delimiter.  It's always preferred to place code into a custom area rather than replacing, but if you must then replacement works.  
3. Your code is simply different.  That situation can arise from one of two situations:
  a. You may simply need to lint your code and remove linting errors.  For instance, it could be that your code using a double quote and the generated code uses a single quote. 
  b. Your code may have missing or altered comment lines for delimiting sections or custom code areas. You may have to look at the generated code a bit to identify the discrepancies.
4. Your code has files that don't appear in the generated code.  You need to move them to the `src/custom` directory.
5. The generated code has files that don't appear in your code.  That normally means that you deleted a generated file.  Technically, that doesn't pose an immediate problem, given that in the worst case a future regeneration of code will add a file.  But the deletion won't last.  Probably there's a better solution by replacement of sections, possibly incorporating code or components programmed within the `src/custom` directory.
