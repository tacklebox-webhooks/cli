const cdk = require("@aws-cdk/core");
const path = require("path");
const lambda = require("@aws-cdk/aws-lambda");
// const ec2 = require("@aws-cdk/aws-ec2");

class HelloCdkStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    console.log(props);
    // const role = new iam.Role(this, "Role", {
    //   assumedBy: new iam.ServicePrincipal("codepipeline.amazonaws.com"),
    //   // custom description if desired
    //   description: "This is a custom role...",
    // });

    // Creates VPC for RDS
    // const myVpc = new ec2.Vpc(this, "VPC", {
    //   cidr: "172.31.0.0/16",
    //   maxAzs: 1,
    //   // maxAzs: 2, creates all subnets on each VPC. So 2 subnets w 2 AZs = 4 subnets
    //   natGateways: 0,
    //   enableDnsHostnames: true,
    //   enableDnsSupport: true,
    //   subnetConfiguration: [
    //     {
    //       cidrMask: 24,
    //       name: "privateSubnetA",
    //       subnetType: ec2.SubnetType.ISOLATED,
    //     },
    //     {
    //       cidrMask: 24,
    //       name: "privateSubnetB",
    //       subnetType: ec2.SubnetType.ISOLATED,
    //     },
    //   ],
    // });

    const fn = new lambda.Function(this, "MyFunction", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "..", "myLambda")),
      // vpc: myVpc,
      // role: role, use custom IAM Role
    });

    // new InterfaceVpcEndpoint(stack, 'VPC Endpoint', {
    //   vpc,
    //   service: new InterfaceVpcEndpointService('com.amazonaws.vpce.us-east-1.vpce-svc-uuddlrlrbastrtsvc', 443),
    //   // Choose which availability zones to place the VPC endpoint in, based on
    //   // available AZs
    //   subnets: {
    //     availabilityZones: ['us-east-1a', 'us-east-1c']
    //   }
    // });

    // const mySecurityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
    //   vpc,
    //   description: 'Allow ssh access to ec2 instances',
    //   allowAllOutbound: true   // Can be set to false
    // });
    // mySecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access from the world');
  }
}

module.exports = { HelloCdkStack };
