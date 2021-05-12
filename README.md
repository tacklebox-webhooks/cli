# dispatchr

While in development, you should be able to run this in the base directory by doing the following:

```javascript
npm link //you only need to run this the very first time you use this
tacklebox build
tacklebox destroy
```

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dispatchr.svg)](https://npmjs.org/package/dispatchr)
[![Downloads/week](https://img.shields.io/npm/dw/dispatchr.svg)](https://npmjs.org/package/dispatchr)
[![License](https://img.shields.io/npm/l/dispatchr.svg)](https://github.com/ArmandoMota/dispatchr/blob/master/package.json)

<!-- toc -->
* [dispatchr](#dispatchr)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g tacklebox
$ tacklebox COMMAND
running command...
$ tacklebox (-v|--version|version)
tacklebox/0.0.0 darwin-x64 node-v16.1.0
$ tacklebox --help [COMMAND]
USAGE
  $ tacklebox COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`tacklebox build`](#tacklebox-build)
* [`tacklebox destroy`](#tacklebox-destroy)
* [`tacklebox help [COMMAND]`](#tacklebox-help-command)
* [`tacklebox ui`](#tacklebox-ui)

## `tacklebox build`

The 'build' command sets up all of the AWS infrastructure that is required to run the

```
USAGE
  $ tacklebox build

DESCRIPTION
  Tacklebox webhook service.  It takes no arguments and relies on the AWS CLI, which
     needs to be installed and configured before using this command.
```

_See code: [src/commands/build.js](https://github.com/hook-captain/cli/blob/v0.0.0/src/commands/build.js)_

## `tacklebox destroy`

The 'destroy' command tears down all of the AWS infrastructure that is required to run the

```
USAGE
  $ tacklebox destroy

DESCRIPTION
  Tacklebox webhook service.  It takes no arguments and relies on the AWS CLI, which
  needs to be installed and configured before using this command.
```

_See code: [src/commands/destroy.js](https://github.com/hook-captain/cli/blob/v0.0.0/src/commands/destroy.js)_

## `tacklebox help [COMMAND]`

display help for tacklebox

```
USAGE
  $ tacklebox help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `tacklebox ui`

Describe the command here

```
USAGE
  $ tacklebox ui

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/ui.js](https://github.com/hook-captain/cli/blob/v0.0.0/src/commands/ui.js)_
<!-- commandsstop -->
