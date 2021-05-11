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

- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g dispatchr
$ dispatchr COMMAND
running command...
$ dispatchr (-v|--version|version)
dispatchr/0.0.0 darwin-x64 node-v12.18.1
$ dispatchr --help [COMMAND]
USAGE
  $ dispatchr COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`dispatchr build`](#dispatchr-build)
- [`dispatchr destroy`](#dispatchr-destroy)
- [`dispatchr hello`](#dispatchr-hello)
- [`dispatchr help [COMMAND]`](#dispatchr-help-command)

## `dispatchr build`

Describe the command here

```
USAGE
  $ dispatchr build

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/build.js](https://github.com/ArmandoMota/dispatchr/blob/v0.0.0/src/commands/build.js)_

## `dispatchr destroy`

Describe the command here

```
USAGE
  $ dispatchr destroy

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/destroy.js](https://github.com/ArmandoMota/dispatchr/blob/v0.0.0/src/commands/destroy.js)_

## `dispatchr hello`

```
USAGE
  $ dispatchr hello
```

_See code: [src/commands/hello.js](https://github.com/ArmandoMota/dispatchr/blob/v0.0.0/src/commands/hello.js)_

## `dispatchr help [COMMAND]`

display help for dispatchr

```
USAGE
  $ dispatchr help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

<!-- commandsstop -->
