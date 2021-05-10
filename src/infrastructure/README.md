# Deploy our WHaaS to AWS using AWS Cloud Development Kit

These are the steps that you'll probably need to run in order to deploy the infrastructure to your AWS account. Most of steps simply installs the depencies needed and could be simplified by using an `npm` script. I'm keeping it like this for now so that we can easily troubleshoot as needed.

## Deployment guidelines

### Prerequisites

- an AWS account
- AWS CLI installed and configured on your local machine
- npm installed on your local machine
- Whole deployment should take about 15-20 minutes.

If you run into difficulties, you might have to run the following commands:

- `npm install -g aws-cdk`: this install the CLI for using the Cloud Development Kit globally on your system.
- `cdk bootstrap`: this might be needed to bundle up the lambda with its dependencies. You can run the command from the root directory if needed (you'll be instructed to do so if there's an issue).

## Notes and Issues still needing to be addressed

- The `aws-stack.js` file in the `lib` folder is where all the stack creation code is.
- Started testing Create event type and got the following error:

`2021-05-09T22:57:45.703Z 55899f5b-81d9-4e55-b8d9-e3dea1a059d4 ERROR Error [AuthorizationError]: Cross-account pass role is not allowed. at Request.extractError (/var/runtime/node_modules/aws-sdk/lib/protocol/query.js:50:29) at Request.callListeners (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:106:20) at Request.emit (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:78:10) at Request.emit (/var/runtime/node_modules/aws-sdk/lib/request.js:688:14) at Request.transition (/var/runtime/node_modules/aws-sdk/lib/request.js:22:10) at AcceptorStateMachine.runTo (/var/runtime/node_modules/aws-sdk/lib/state_machine.js:14:12) at /var/runtime/node_modules/aws-sdk/lib/state_machine.js:26:10 at Request.<anonymous> (/var/runtime/node_modules/aws-sdk/lib/request.js:38:9) at Request.<anonymous> (/var/runtime/node_modules/aws-sdk/lib/request.js:690:12) at Request.callListeners (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:116:18) { code: 'AuthorizationError', time: 2021-05-09T22:57:45.642Z, requestId: '9e891bee-6d2d-54aa-a291-42fc0604aa20', statusCode: 403, retryable: false, retryDelay: 28.78525630400468 }`

## Useful commands

- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
