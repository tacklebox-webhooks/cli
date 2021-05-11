const { Command, flags } = require("@oclif/command");
const Listr = require("listr");
const importTbCode = require("../tasks/importTbCode");
const createTbCfTemp = require("../tasks/createTbCfTemp");
const bootstrapTb = require("../tasks/bootstrapTb");
const deployTb = require("../tasks/deployTb");

// const importUiCode = require("../tasks/importUiCode");
// const createUiBuild = require("../tasks/createUiBuild");
// const deployUi = require("../tasks/deployUi");

class BuildCommand extends Command {
  async run() {
    console.log(
      "\nDeploying dispatchr webhook service infrastructure.  This may take 10+ minutes.\n"
    );
    const tasks = new Listr([
      {
        title: "Installing dependencies",
        task: importTbCode,
      },
      {
        title: "Cloud Formation Template Creation",
        task: createTbCfTemp,
      },
      {
        title: "Bootstrapping Deployment",
        task: bootstrapTb,
      },
      {
        title: "Deploying Infrastructure",
        task: deployTb,
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
