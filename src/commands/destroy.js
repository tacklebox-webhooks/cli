const { Command, flags } = require("@oclif/command");
const Listr = require("listr");
const destroyTb = require("../tasks/destroyTb");
const destroyPermissions = require("../tasks/destroyPermissions");
const removeTbCode = require("../tasks/removeTbCode");
const destroyUI = require("../tasks/destroyUI");

class DestroyCommand extends Command {
  async run() {
    console.log(
      "\nTearing down Tacklebox webhook service infrastructure.  This may take 10+ minutes.\n"
    );
    const tasks = new Listr([
      {
        title: "Tear down infrastructure",
        task: destroyTb,
      },
      {
        title: "Remove IAM Roles",
        task: destroyPermissions,
      },
      {
        title: "Remove AWS component code",
        task: removeTbCode,
      },
      {
        title: "Remove UI code",
        task: destroyUI,
      },
    ]);

    await tasks.run().catch((err) => {
      console.error(err);
    });
  }
}

DestroyCommand.description = `tears down all of the AWS infrastructure that is required to run the ` +
`Tacklebox webhook service.  It takes no arguments and relies on the AWS CLI, which ` +
`needs to be installed and configured before using this command.`;

module.exports = DestroyCommand;
