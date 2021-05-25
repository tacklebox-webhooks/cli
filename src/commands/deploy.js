const { Command, flags } = require("@oclif/command");
const Listr = require("listr");
const importTbCode = require("../tasks/importTbCode");
const importLambdaCode = require("../tasks/importLambdaCode");
const importUiCode = require("../tasks/importUiCode");
const createTbCfTemp = require("../tasks/createTbCfTemp");
const bootstrapTb = require("../tasks/bootstrapTb");
const deployPermissions = require("../tasks/deployPermissions");
const deployTb = require("../tasks/deployTb");
const populateDb = require("../tasks/populateDb");
const populateUiEnv = require("../tasks/populateUiEnv");
const createUiBuild = require("../tasks/createUiBuild");
const outputTackleboxUrl = require("../tasks/outputTackleboxUrl");
const outputTackleboxLogo = require("../tasks/outputTackleboxLogo");

class BuildCommand extends Command {
  async run() {
    outputTackleboxLogo();

    const tasks = new Listr([
      {
        title: "AWS CDK module import",
        task: importTbCode,
      },
      {
        title: "AWS Lambda module import",
        task: importLambdaCode,
      },
      {
        title: "AWS UI module import",
        task: importUiCode,
      },
      {
        title: "AWS CloudFormation template generation",
        task: createTbCfTemp,
      },
      {
        title: "Bootstrap deployment",
        task: bootstrapTb,
      },
      {
        title: "Permissions deployment",
        task: deployPermissions,
      },
      {
        title: "Infrastructure deployment",
        task: deployTb,
      },
      {
        title: "UI environment configuration",
        task: populateUiEnv,
      },
      {
        title: "Static UI build",
        task: createUiBuild,
      },
      {
        title: "Database scaffolding",
        task: populateDb,
      },
    ]);

    await tasks.run().catch((err) => {
      console.error(err);
    });

    outputTackleboxUrl();
  }
}

BuildCommand.description = `The 'deploy' command sets up all of the AWS infrastructure that is required to run the
  Tacklebox webhook service.  It takes no arguments and relies on the AWS CLI and AWS CDK, which
  need to be installed and configured before using this command.`;

module.exports = BuildCommand;
