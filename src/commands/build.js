const { Command, flags } = require("@oclif/command");
const Listr = require("listr");
const createCfTemplate = require("../tasks/createCfTemplate");
const bootstrapDeployment = require("../tasks/bootstrapDeployment");
const deployInfrastructure = require("../tasks/deployInfrastructure");

class BuildCommand extends Command {
  async run() {
    console.log(
      "\nDeploying dispatchr webhook service infrastructure.  This may take 10+ minutes.\n"
    );
    const tasks = new Listr([
      {
        title: "Cloud Formation Template Creation",
        task: createCfTemplate,
      },
      {
        title: "Bootstrapping Deployment",
        task: bootstrapDeployment,
      },
      {
        title: "Deploying Infrastructure",
        task: deployInfrastructure,
      },
    ]);

    tasks.run().catch((err) => {
      console.error(err);
    });
  }
}

BuildCommand.description = `The 'build' command sets up all of the AWS infrastructure that is required to run the
  dispatchr webhook service.  It takes no arguments and relies on the AWS CLI, which
  needs to be installed and configured before using this command.`;

module.exports = BuildCommand;
