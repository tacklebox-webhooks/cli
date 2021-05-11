const { Command, flags } = require("@oclif/command");
const Listr = require("listr");
const destroyTb = require("../tasks/destroyTb");
const removeTbCode = require("../tasks/removeTbCode");

// const destroyUi = require("../tasks/destroyUi");

class DestroyCommand extends Command {
  async run() {
    console.log(
      "\nTearing down dispatchr webhook service infrastructure.  This may take 10+ minutes.\n"
    );
    const tasks = new Listr([
      {
        title: "Tearing down infrastructure",
        task: destroyTb,
      },
      {
        title: "Removing AWS component code",
        task: removeTbCode,
      },
    ]);

    tasks.run().catch((err) => {
      console.error(err);
    });
  }
}

DestroyCommand.description = `The 'destroy' command tears down all of the AWS infrastructure that is required to run the
dispatchr webhook service.  It takes no arguments and relies on the AWS CLI, which
needs to be installed and configured before using this command.`;

module.exports = DestroyCommand;
