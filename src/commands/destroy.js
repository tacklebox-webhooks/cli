const { Command, flags } = require("@oclif/command");
const Listr = require("listr");
const apiGateway = require("../tasks/apiGateway");
const lambdas = require("../tasks/lambdas");
const rds = require("../tasks/rds");
const sns = require("../tasks/sns");

class DestroyCommand extends Command {
  async run() {
    // const { flags } = this.parse(BuildCommand);
    // const name = flags.name || "world";
    console.log("\nTearing down dispatchr webhook service infrastructure\n");
    const tasks = new Listr([
      {
        title: "API Gateway",
        task: apiGateway.teardown,
      },
      {
        title: "Lambdas",
        task: lambdas.teardown,
      },
      {
        title: "RDS",
        task: rds.teardown,
      },
      {
        title: "SNS",
        task: sns.teardown,
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

// DestroyCommand.flags = {
//   name: flags.string({char: 'n', description: 'name to print'}),
// }

module.exports = DestroyCommand;
