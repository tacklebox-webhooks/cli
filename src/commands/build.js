const { Command, flags } = require("@oclif/command");
const Listr = require("listr");
const apiGateway = require("../tasks/apiGateway");
const lambdas = require("../tasks/lambdas");
const rds = require("../tasks/rds");
const sns = require("../tasks/sns");

class BuildCommand extends Command {
  async run() {
    // const { flags } = this.parse(BuildCommand);
    // const name = flags.name || "world";
    console.log("\nDeploying dispatchr webhook service infrastructure\n");
    const tasks = new Listr([
      {
        title: "API Gateway",
        task: apiGateway.build,
      },
      {
        title: "Lambdas",
        task: lambdas.build,
      },
      {
        title: "RDS",
        task: rds.build,
      },
      {
        title: "SNS",
        task: sns.build,
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

// BuildCommand.flags = {
//   name: flags.string({char: 'n', description: 'name to print'}),
// }

module.exports = BuildCommand;
