const { Command, flags } = require("@oclif/command");
const { exec } = require("child_process");

const command = "cd src/ui/server && npm run deploy";

class UiCommand extends Command {
  async run() {
    console.log(
      "\nRunning management UI for Tacklebox on http://localhost:3001\n"
    );
    exec(command, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error.message);
      }
    });
  }
}

UiCommand.description = `This command spins up Tacklebox's management UI ` +
  `on localhost:3001`;

module.exports = UiCommand;
