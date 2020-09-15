ns-front
========
The ns-front CLI is a meta-tool for working with *replaceable* front end templates.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ns-front.svg)](https://npmjs.org/package/ns-front)
[![Downloads/week](https://img.shields.io/npm/dw/ns-front.svg)](https://npmjs.org/package/ns-front)
[![License](https://img.shields.io/npm/l/ns-front.svg)](https://github.com/https://github.com/NoStackApp/ns-front/blob/master/package.json)

<!-- toc -->
* [Why](#why)
* [What](#what)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Why
Today good software must change all the time.  The ideal is to leverage external packages for everything that you can but to be a slave to none of them.

That may seem contradictory.  The more you use other packages, the more potential conflicts you invite.  The challenge is to minimize your code but to be able to maintain it as other packages update under your feet.

# What
ns-front is a meta-templating CLI.  You can create templates for yourself or others that have regions built in for customized code.  That in itself is not unique.

What is more special is that templates of a certain category are *exchangeable*. That means that, after you've created your code, you can replace or update the template and your custom changes will persist to the new version, WordPress style! In WordPress, any two templates can be interchanged as long as they share the same fields.  The same way, with ns-front you can interchange two templates with the same category and fields.  (By category we mean things like framework, back end tool, etc. that influence what you need.)

Currently, a template must be stored in a repo and distributed separately, and must conform to required standards explained below.

Features include:
* A `test` command to be sure that no custom code you created violates the standards for the template. The test ensures that custome code conforms to the [NoStack Front End Guidelines](https://bit.ly/nsFrontEndRules). (Otherwise, you could lose your custom code when you update your template!)
* a `newapp` command to generate an "empty" placeholder app of the type used by a template.  (Kind of like create-react-app creates a placeholder React app.) The template specifies how such a placeholder gets created, so if you like you can use ns-front to let others generate some unique type of application.
* [Coming Soon] A command `makecode` that generates an app from a template.
* Rather than limiting an app to standard pages, a template relies upon a flexible specification with the units and hierarchies of components that you need in your app. Also, a template can (and should) allow for custom styling, so that any mockup can be used with a decent template.
* Use of handlebars with a simple standard structure for templates.
* [Coming Soon] A searchable list for registering templates, so that if you create a template others can find it.

We're working very hard right now to get this working.  If you want to help with this project, please open issues and start talking to us!

# Usage
<!-- usage -->
```sh-session
$ npm install -g ns-front
$ nsfront COMMAND
running command...
$ nsfront (-v|--version|version)
ns-front/0.3.0 linux-x64 node-v14.9.0
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

_See code: [src/commands/test.ts](https://github.com/NoStackApp/ns-front/blob/v0.3.0/src/commands/test.ts)_
<!-- commandsstop -->

#Using Templates
Follow these steps:
1. Clone the template to your local.
2. Call `nsfront newapp -t <template dir> -a <placeholder app directory>` and the placeholder app will be created wherever you specified. This step may take some time (for instance, if the template has to install a lot of packages).
3. Copy your placeholder app to a new app directory (or just use the placeholder itself).
4. Open the `app.yml` file in the "meta" directory.  You need to replace `myApp` with the name that you want, and if necessary globally replace `user` with whatever you want for the user for that app, e.g. `buyer`.  
5. You need to create a set of units under units. The symantic meaning of a unit will vary depending upon the template, but you can roughly think of them as pages or screens in your app. Each one must have a `hierarchy` of data types.  See [Creating a Data Type Hierarchy](##Creating a Data Type Hierarchy) below.
6. Call `makecode` to generate your app code according to the template.

##Creating a Data Type Hierarchy
A Unit is a building block for an app user interface.  It also can be a query to the back end.  `ns-front` expects a hierarchy of data types for each unit.  So a 'unit' in `ns-front` terms is a hierarchy of types where each type appears only once in that unit  More complex interfaces can be built with joining units, which provides complete querying expressive power.

You can, of course, start simple and build them up.  Any time you like, you can call `makecode` and it will modify the code that you have so far to include changes to your units and their hierarchies.

To create a hierarchy, think in terms of what you want to display.  If for instance you expect to show a list of watches as the highest level of a UI unit, then your hierarchy should be rooted in watches.  Maybe for each watch you will have a list of sellers.  
```
catalog:
    hierarchy:
        watch:
            store:
                location: null
                hours: null
                phone: null
        cost: null
```
But if you want the sellers to be shown on the top with the watches that they carry, then you'd reverse that.
 
```
catalog:
    hierarchy:
        store:
            location: null
            hours: null
            phone: null
            watch
                cost: null
```
You can extend a hierarchy as many levels deep as you like.  When a type has no child types, it should receive the value of null.

Note that nothing is stated in the hierarchy about data type.  Every type in a hierarchy can be a string, a number, a or a set.  By default, everything is a string.  When you want to generate a backend as well, you need to provide more information. But to start you can try producing something with just strings.

#Working with Test Results
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

# Creating Templates
To create templates, you have to know the basics of handlebars.  (It's a very simple language to learn.)

It's also helpful to understand clearly that ns-front templates generate two types of files:
1. _type files_ are files generated for particular data types in an app's hierarchy.  That hierarchy is dynamically determined from an `app.yml` file when `nsfront makecode` is run.  For instance, if an app uses watches, there may be a type `watch` in the `app.yml` file, and there may be multiple component files created for watches, included `Watch.jsx`, `Watches.jsx` and `CreateWatchForm.jsx`.
2. _standard files_ are always generated, regardless of specifics about the app.  So for instance every app may contain a standard file `client.js`.

A template is a directory containing the following:
* A `config.yml` file telling various configurations.
* A general file template `generic.hbs` from which files for data are generated (see below).
* a `fileTemplates` directory containing handlebars templates for the standard files. Files should have an `.hbs` extension.  You can create any number of subdirectories.
* An optional `partials` directory containing handebars partials files.  As with `fileTemplates, you can add any number of subdirectories.  NsFront will read in your partials before generating files and you can make reference to them in your template files.

See our [Sample Template](https://github.com/YizYah/basicNsFrontTemplate).
