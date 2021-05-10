const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const Aws = require('../lib/aws-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Aws.AwsStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
