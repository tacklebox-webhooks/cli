<p align="center">
  <img src="https://i.imgur.com/s9Gvwsg.png">
</p>

[![Tacklebox](https://img.shields.io/badge/tacklebox-case%20study-blue)](https://tacklebox-webhooks.github.io)

## Overview

Tacklebox is an open-source serverless framework that offers webhooks as a service.

It includes:
- a [CLI tool](https://github.com/tacklebox-webhooks/cli) to deploy and manage AWS infrastructure
- 4 client libraries ([JavaScript](https://github.com/tacklebox-webhooks/javascript),
    [Ruby](https://github.com/tacklebox-webhooks/ruby),
    [Python](https://github.com/tacklebox-webhooks/python),
    and [Go](https://github.com/tacklebox-webhooks/golang))
- a RESTful API
- a management UI

You can read more about our case study [here](https://tacklebox-webhooks.github.io"),
and you can also watch our presentation [here](https://www.youtube.com/watch?v=QEFFlWNNwk8&t=1s).

## The Team
**Juan Palma** *Software Engineer* Phoenix, AZ

**Kevin Counihan** *Software Engineer* Seattle, WA

**Armando Mota** *Software Engineer* Los Angeles, CA

**Kayl Thomas** *Software Engineer* Atlanta, GA

## Getting Started

### Prerequisites
* AWS account
* AWS CLI
* AWS CDK
* Node.js >= 8.10
* NPM

Tacklebox requires that users have an account with AWS, have set up an
AWS CLI configuration as well as have installed the AWS CDK on their local machine.
If you have not already done so, please visit
[Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
and [Configuring the AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/cli.html)
for instructions. Tacklebox will use the default credentials and region specified
within that profile in order to interact with AWS services.

### Install Tacklebox

To install Tacklebox globally to be able to run commands, run:

``` bash
npm install -g tacklebox-webhooks
```
---

## Commands

Tacklebox commands conform to the following structure:
```
tacklebox <commandName>
```

---

#### `tacklebox deploy`
*Used to deploy AWS infrastructure. Once the process finishes, you*
*will be provided with the API Host, which is the base URL*
*you will use to communicate with the Tacklebox API, and the API Key,*
*which is the key the Tacklebox API uses to authenticate you.*

The `deploy` command will create instances of the below:
- API Gateway resource
- Lambda functions
- RDS instance with PostgreSQL
- VPC
- IAM roles

---

#### `tacklebox ui`
*Run management UI locally.*

---
#### `tacklebox destroy`
*Tear down AWS infrastructure.*

---

#### `tacklebox help`
*Documentation of commands.*

---

## Helpful Tips

### Accessing AWS services

Tacklebox deploys instances of multiple AWS services. While these instances can be deleted
using the `destroy` command, they can also be accessed and modified using the
[AWS CLI](https://docs.aws.amazon.com/cli/index.html) or via the
[web console](https://console.aws.amazon.com/console/home).

### Message ordering

Tacklebox does not guarantee delivery of messages in the order in which they are generated.
