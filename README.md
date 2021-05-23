![Tacklebox Logo](https://i.imgur.com/s9Gvwsg.png) 

[![Tacklebox](https://img.shields.io/badge/tacklebox-case%20study-blue)](https://tacklebox-webhooks.github.io)

## Overview

Tacklebox is an open-source serverless framework that offers webhooks as a service.

It includes:
- a CLI tool to deploy and manage AWS infrastructure
- 4 client libraries (JavaScript, Ruby, Python and Go)
- a RESTful API with docs
- an admin UI

<!--<img src="https://i.imgur.com/00Yy8JA.gif" width="600" alt="Tacklebox deploy" />-->

### Tacklebox Architecture

<!--![Tacklebox components](https://i.imgur.com/FEghmSi.png)-->

## The Team
**Juan Palma** *Software Engineer* Phoenix, AZ

**Kevin Counihan** *Software Engineer* Seattle, WA

**Armando Mota** *Software Engineer* Los Angeles, CA

**Kayl Thomas** *Software Engineer* Atlanta, GA

<!--**[Sachin Chandy](https://sachinmc.github.io)** *Software Engineer* London, UK-->

<!--**[Wendy Kuhn](https://wendykuhn.io)** *Software Engineer* Austin, TX-->

<!--**[Nick Miller](https://nickmiller.io)** *Software Engineer* Los Angeles, CA-->

## Getting Started

### Prerequisites
* AWS account
* AWS CLI
* AWS CDK
* Node.js >= 8.10
* NPM

Tacklebox requires that users have an account with AWS and have set up an AWS CLI configuration on their local machine.
If you have not already done so, please visit [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
and [Configuring the AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/cli.html) for instructions.
Tacklebox will use the default credentials and region specified within that profile in order to interact with AWS services.

### Install Tacklebox
``` bash
npm install tacklebox-webhooks
```
---

## Commands

Tacklebox commands conform to the following structure:
```
tacklebox <commandName>
```

---

#### `tacklebox deploy`
*deploy AWS infrastructure. API Host will be provided once process finishes.*

The `deploy` command will create instances of the below:
- API Gateway resource
- SNS topic
- CloudWatch Logs log groups
- Lambda functions
- RDS instance with PostgreSQL
- VPC

The first time the `deploy` command is run, Tacklebox will also create:
- a hidden directory within the user's home directory that holds configuration files and serves as a staging directory for deploying the Lambda functions
- IAM roles

---

#### `tacklebox destroy`
*tear down AWS infrastructure.*

---

#### `tacklebox help`
*documentation of commands*

---

## Helpful Tips

### Accessing AWS services

Tacklebox deploys instances of multiple AWS services. While these instances can be deleted using the `destroy` command, they can also be accessed and modified using the [AWS CLI](https://docs.aws.amazon.com/cli/index.html) or via the [web console](https://console.aws.amazon.com/console/home).

### Message ordering

Tacklebox does not guarantee delivery of messages in the order in which they are generated.

### Accessing database

<!--1. From the directory with the `Tacklebox.pem` keypair file, SSH into the EC2 instance.<br />-->
<!--*Connection details can be found by navigating to the EC2 section of the web console, and clicking the 'Connect' button once the EC2 instance is selected.*-->
<!--2. Type `yes` when prompted to finish initiating the connection.-->
<!--3. Type `sudo docker exec -it TackleboxStore bash` to create a new Bash session in the running `TackleboxStore` MongoDB container.-->
<!--4. Type `mongo Tacklebox` to start the Mongo shell with database `Tacklebox`.-->
<!--5. Access your webhook data in `TackleboxCollection`.-->

#### Common commands include:
  <!--- `db.TackleboxCollection.find()` - retrieves all documents from `TackleboxCollection`-->
  <!--- `db.TackleboxCollection.count()` - display the number of documents in `TackleboxCollection`-->

<!----------------------------------->

<!--# dispatchr-->

<!--While in development, you should be able to run this in the base directory by doing the following:-->

<!--```javascript-->
<!--npm link //you only need to run this the very first time you use this-->
<!--tacklebox build-->
<!--tacklebox destroy-->
<!--```-->

<!--[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)-->
<!--[![Version](https://img.shields.io/npm/v/dispatchr.svg)](https://npmjs.org/package/dispatchr)-->
<!--[![Downloads/week](https://img.shields.io/npm/dw/dispatchr.svg)](https://npmjs.org/package/dispatchr)-->
<!--[![License](https://img.shields.io/npm/l/dispatchr.svg)](https://github.com/ArmandoMota/dispatchr/blob/master/package.json)-->

<!-- toc -->
<!--* [dispatchr](#dispatchr)-->
<!--* [Usage](#usage)-->
<!--* [Commands](#commands)-->
<!-- tocstop -->

<!--# Usage-->

<!-- usage -->
<!--```sh-session-->
<!--$ npm install -g tacklebox-->
<!--$ tacklebox COMMAND-->
<!--running command...-->
<!--$ tacklebox (-v|--version|version)-->
<!--tacklebox/0.0.0 darwin-x64 node-v16.1.0-->
<!--$ tacklebox --help [COMMAND]-->
<!--USAGE-->
<!--  $ tacklebox COMMAND-->
<!--...-->
<!--```-->
<!-- usagestop -->

<!--# Commands-->

<!-- commands -->
<!--* [`tacklebox build`](#tacklebox-build)-->
<!--* [`tacklebox destroy`](#tacklebox-destroy)-->
<!--* [`tacklebox help [COMMAND]`](#tacklebox-help-command)-->
<!--* [`tacklebox ui`](#tacklebox-ui)-->

<!--## `tacklebox build`-->

<!--The 'build' command sets up all of the AWS infrastructure that is required to run the-->

<!--```-->
<!--USAGE-->
<!--  $ tacklebox build-->

<!--DESCRIPTION-->
<!--  Tacklebox webhook service.  It takes no arguments and relies on the AWS CLI, which-->
<!--     needs to be installed and configured before using this command.-->
<!--```-->

<!--_See code: [src/commands/build.js](https://github.com/hook-captain/cli/blob/v0.0.0/src/commands/build.js)_-->

<!--## `tacklebox destroy`-->

<!--The 'destroy' command tears down all of the AWS infrastructure that is required to run the-->

<!--```-->
<!--USAGE-->
<!--  $ tacklebox destroy-->

<!--DESCRIPTION-->
<!--  Tacklebox webhook service.  It takes no arguments and relies on the AWS CLI, which-->
<!--  needs to be installed and configured before using this command.-->
<!--```-->

<!--_See code: [src/commands/destroy.js](https://github.com/hook-captain/cli/blob/v0.0.0/src/commands/destroy.js)_-->

<!--## `tacklebox help [COMMAND]`-->

<!--display help for tacklebox-->

<!--```-->
<!--USAGE-->
<!--  $ tacklebox help [COMMAND]-->

<!--ARGUMENTS-->
<!--  COMMAND  command to show help for-->

<!--OPTIONS-->
<!--  --all  see all commands in CLI-->
<!--```-->

<!--_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_-->

<!--## `tacklebox ui`-->

<!--Describe the command here-->

<!--```-->
<!--USAGE-->
<!--  $ tacklebox ui-->

<!--OPTIONS-->
<!--  -n, --name=name  name to print-->

<!--DESCRIPTION-->
<!--  ...-->
<!--  Extra documentation goes here-->
<!--```-->

<!--_See code: [src/commands/ui.js](https://github.com/hook-captain/cli/blob/v0.0.0/src/commands/ui.js)_-->
<!-- commandsstop -->
