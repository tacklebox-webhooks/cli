const cdk = require("@aws-cdk/core");
const lambda = require("@aws-cdk/aws-lambda");
const rds = require("@aws-cdk/aws-rds");
const ec2 = require("@aws-cdk/aws-ec2"); //for vpc
const sns = require("@aws-cdk/aws-sns");
const apigateway = require("@aws-cdk/aws-apigateway");
//const path = require("path");
//const { randomBytes } = require("crypto");

class AwsStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
    // The code that defines your stack goes here

    // VPC setup
    const vpc = new ec2.Vpc(this, "kth-vpc", {
      maxAzs: 2,
      natGateways: 1,
    });

    vpc.addInterfaceEndpoint("SnsEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.SNS,
    });

    vpc.addInterfaceEndpoint("LogsEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
    });

    vpc.addInterfaceEndpoint("LambdaEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.LAMBDA,
    });

    const credentials = rds.Credentials.fromPassword(
      "syscdk",
      cdk.SecretValue.plainText("testing123!")
    );

    const vpcSubnets = {
      subnetType: ec2.SubnetType.PRIVATE,
    };

    // RDS Postgres setup
    const db = new rds.DatabaseInstance(this, "teamfourdb", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_12_5,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.SMALL
      ),
      databaseName: "WHaaSDB",
      credentials,
      vpc,
      vpcSubnets,
    });

    db.connections.allowFrom(
      ec2.Peer.ipv4("10.0.0.0/16"),
      ec2.Port.tcp(db.dbInstanceEndpointPort)
    );

    // Lambda Setups
    const dbSetup = new lambda.Function(this, "dbSetup", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("./lambdas/resetDB"),
      timeout: cdk.Duration.seconds(5),
      vpc,
      vpcSubnets,
      environment: {
        DATABASE_USER: credentials.username,
        DATABASE_HOST: db.dbInstanceEndpointAddress,
        DATABASE_PORT: db.dbInstanceEndpointPort,
        DATABASE_NAME: "WHaaSDB",
        DATABASE_PASSWORD: credentials.password,
      },
    });
    const dbSetupIntegration = new apigateway.LambdaIntegration(dbSetup);

    const servicesLambda = new lambda.Function(this, "ManageServices", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("./lambdas/services"),
      timeout: cdk.Duration.seconds(5),
      vpc,
      vpcSubnets,
      environment: {
        DATABASE_USER: credentials.username,
        DATABASE_HOST: db.dbInstanceEndpointAddress,
        DATABASE_PORT: db.dbInstanceEndpointPort,
        DATABASE_NAME: "WHaaSDB",
        DATABASE_PASSWORD: credentials.password,
      },
    });
    const servicesLambdaIntegration = new apigateway.LambdaIntegration(
      servicesLambda
    );

    const eventsLambda = new lambda.Function(this, "ManageEvents", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("./lambdas/events"),
      timeout: cdk.Duration.seconds(5),
      vpc,
      vpcSubnets,
      environment: {
        DATABASE_USER: credentials.username,
        DATABASE_HOST: db.dbInstanceEndpointAddress,
        DATABASE_PORT: db.dbInstanceEndpointPort,
        DATABASE_NAME: "WHaaSDB",
        DATABASE_PASSWORD: credentials.password,
      },
    });
    const eventsLambdaIntegration = new apigateway.LambdaIntegration(
      eventsLambda
    );

    const eventTypesLambda = new lambda.Function(this, "ManageEventTypes", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("./lambdas/eventTypes"),
      timeout: cdk.Duration.seconds(5),
      vpc,
      vpcSubnets,
      environment: {
        DATABASE_USER: credentials.username,
        DATABASE_HOST: db.dbInstanceEndpointAddress,
        DATABASE_PORT: db.dbInstanceEndpointPort,
        DATABASE_NAME: "WHaaSDB",
        DATABASE_PASSWORD: credentials.password,
      },
    });
    const eventTypesLambdaIntegration = new apigateway.LambdaIntegration(
      eventTypesLambda
    );

    const logsLambda = new lambda.Function(this, "ManageLogs", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("./lambdas/logMessages"),
      timeout: cdk.Duration.seconds(5),
      vpc,
      vpcSubnets,
      environment: {
        DATABASE_USER: credentials.username,
        DATABASE_HOST: db.dbInstanceEndpointAddress,
        DATABASE_PORT: db.dbInstanceEndpointPort,
        DATABASE_NAME: "WHaaSDB",
        DATABASE_PASSWORD: credentials.password,
      },
    });

    const messagesLambda = new lambda.Function(this, "ManageMessages", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("./lambdas/messages"),
      timeout: cdk.Duration.seconds(5),
      vpc,
      vpcSubnets,
      environment: {
        DATABASE_USER: credentials.username,
        DATABASE_HOST: db.dbInstanceEndpointAddress,
        DATABASE_PORT: db.dbInstanceEndpointPort,
        DATABASE_NAME: "WHaaSDB",
        DATABASE_PASSWORD: credentials.password,
      },
    });
    const messagesLambdaIntegration = new apigateway.LambdaIntegration(
      messagesLambda
    );

    const subscriptionsLambda = new lambda.Function(
      this,
      "ManageSubscriptions",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "index.handler",
        code: lambda.Code.fromAsset("./lambdas/subscriptions"),
        timeout: cdk.Duration.seconds(5),
        vpc,
        vpcSubnets,
        environment: {
          DATABASE_USER: credentials.username,
          DATABASE_HOST: db.dbInstanceEndpointAddress,
          DATABASE_PORT: db.dbInstanceEndpointPort,
          DATABASE_NAME: "WHaaSDB",
          DATABASE_PASSWORD: credentials.password,
        },
      }
    );
    const subscriptionsLambdaIntegration = new apigateway.LambdaIntegration(
      subscriptionsLambda
    );

    const usersLambda = new lambda.Function(this, "ManageUsers", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("./lambdas/users"),
      timeout: cdk.Duration.seconds(5),
      vpc,
      vpcSubnets,
      environment: {
        DATABASE_USER: credentials.username,
        DATABASE_HOST: db.dbInstanceEndpointAddress,
        DATABASE_PORT: db.dbInstanceEndpointPort,
        DATABASE_NAME: "WHaaSDB",
        DATABASE_PASSWORD: credentials.password,
      },
    });
    const usersLambdaIntegration = new apigateway.LambdaIntegration(
      usersLambda
    );

    // API Gateway Setup and Lambda/Route Integrations
    const api = new apigateway.RestApi(this, "teamNameGoesHere");
    api.addApiKey("ApiKey", {
      apiKeyName: "myApiKey4",
      value: "MyApiKeyThatIsAtLeast20Characters",
    });

    const dbSetupRoute = api.root.addResource("dbSetup");
    dbSetupRoute.addMethod("GET", dbSetupIntegration);

    const services = api.root.addResource("services");
    services.addMethod("GET", servicesLambdaIntegration);
    services.addMethod("POST", servicesLambdaIntegration);

    const service = services.addResource("{service_id}");
    service.addMethod("GET", servicesLambdaIntegration);

    const eventTypes = service.addResource("eventTypes");
    eventTypes.addMethod("GET", eventTypesLambdaIntegration);
    eventTypes.addMethod("POST", eventTypesLambdaIntegration);

    const eventType = eventTypes.addResource("{event_type_id}");
    eventType.addMethod("GET", eventTypesLambdaIntegration);

    const users = service.addResource("users");
    users.addMethod("GET", usersLambdaIntegration);
    users.addMethod("POST", usersLambdaIntegration);

    const user = users.addResource("{user_id}");
    user.addMethod("GET", usersLambdaIntegration);

    const events = user.addResource("events");
    events.addMethod("GET", eventsLambdaIntegration);
    events.addMethod("POST", eventsLambdaIntegration);

    const event = events.addResource("{event_id}");
    event.addMethod("GET", eventsLambdaIntegration);

    const messages = user.addResource("messages");
    messages.addMethod("GET", messagesLambdaIntegration);

    const message = messages.addResource("{message_id}");
    message.addMethod("GET", messagesLambdaIntegration);

    const resend = message.addResource("resend");
    resend.addMethod("POST", messagesLambdaIntegration);

    const subscriptions = user.addResource("subscriptions");
    subscriptions.addMethod("GET", subscriptionsLambdaIntegration);
    subscriptions.addMethod("POST", subscriptionsLambdaIntegration);

    const subscription = subscriptions.addResource("{subscription_id}");
    subscription.addMethod("GET", subscriptionsLambdaIntegration);

    const test = subscription.addResource("test");
    test.addMethod("POST", subscriptionsLambdaIntegration);
  }
}

module.exports = { AwsStack };
