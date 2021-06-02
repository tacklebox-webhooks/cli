const { assert } = require('chai');
const Deploy = require('../../src/commands/deploy');
const Destroy = require('../../src/commands/destroy');
const { CloudFormationClient, DescribeStackResourcesCommand } = require("@aws-sdk/client-cloudformation");

const resourceTypes = {};
const tbCommand = new DescribeStackResourcesCommand({StackName: 'Tacklebox'});
const iamCommand = new DescribeStackResourcesCommand({StackName: 'tacklebox-iam'});

async function getResourceTypes(command) {
  const client = new CloudFormationClient();
  const response = await client.send(command);
  response.StackResources.forEach(resource => {
    if (resourceTypes[resource.ResourceType]) return;
    resourceTypes[resource.ResourceType] = resource.ResourceStatus;
  });
}

before(async function() {
  this.timeout(0);
  await Deploy.run();
  await getResourceTypes(tbCommand);
  await getResourceTypes(iamCommand);
});

after(async function() {
  this.timeout(0);
  await Destroy.run();
});

describe('tacklebox deploy', function() {
  this.timeout(0);
  
  it('Creates a CloudFormation Stack using AWS CDK', function() {
    assert.equal(resourceTypes['AWS::CDK::Metadata'], 'CREATE_COMPLETE');
  });
  
  it('Creates a RESTful API on API Gateway', function() {
    assert.equal(resourceTypes['AWS::ApiGateway::RestApi'], 'CREATE_COMPLETE');
  });
  
  it('Creates IAM Policies', function() {
    assert.equal(resourceTypes['AWS::IAM::Policy'], 'CREATE_COMPLETE');
  });
  
  it('Creates IAM Roles', function() {
    assert.equal(resourceTypes['AWS::IAM::Role'], 'CREATE_COMPLETE');
  });
  
  it('Creates Lambda Functions', function() {
    assert.equal(resourceTypes['AWS::Lambda::Function'], 'CREATE_COMPLETE');
  });
  
  it('Sets Lambda Permissions', function() {
    assert.equal(resourceTypes['AWS::Lambda::Permission'], 'CREATE_COMPLETE');
  });
  
  it('Creates an EC2 Security Group', function() {
    assert.equal(resourceTypes['AWS::EC2::SecurityGroup'], 'CREATE_COMPLETE');
  });
});
