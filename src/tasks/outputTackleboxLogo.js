const fs = require("fs");
const chalk = require("chalk");

const logo = `
┌╔╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╖  
┌╣╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╕
╟╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬
╟╬╬╬╬╬╬╬╝╙╙╙╣╬╬╬╬╬╬╬╬╬╣╨         ╙╝╬╬╬╬╬╬╬╬╬╬╬╬╬
╟╬╬╬╬╬╬  ┌╖  ╚╬╬╬╬╬╬╝   ╓╗╣╬╬╬╣╣╗   ╙╬╬╬╬╬╬╬╬╬╬╬
╟╬╬╬╬╬╬  ╙╙  ╔╬╬╬╬╬╜  ╗╬╬╬╬╬╬╬╬╬╬╬╣   ╣╬╬╬╬╬╬╬╬╬
╟╬╬╬╬╬╬╣╗  ╔╣╬╬╬╬╬╝  ╣╬╬╬╬╬╬╬╬╬╬╬╬╬╬   ╬╬╬╬╬╬╬╬╬
╟╬╬╬╬╬╬╬╬  ╠╬╬╬╬╬╬   ╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╣  ╬╬╬╬╬╬╬╬╬
╟╬╬╬╬╬╬╬╬  ╠╬╬╬╬╬╬   ╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╣  ╬╬╬╬╬╬╬╬╬
╟╬╬╬╬╬╬╬╬  ╠╬╬╬╬╬╬   ╬╬╬╬╬╬╬╬╬╣╬╬╬╬╬╣  ╬╬╬╬╬╬╬╬╬
╟╬╬╬╬╬╬╬╬  ╠╬╬╬╬╬╬    ╓╣╬╬╬╬╝ ╣╬╬╬╬╬╣  ╬╬╬╬╬╬╬╬╬
╟╬╬╬╬╬╬╬╬  ╠╬╬╬╬╬╬  ╓╣╬╬╬╬╝   ╬╬╬╬╬╬╣  ╬╬╬╬╬╬╬╬╬
╟╬╬╬╬╬╬╬╬  ╠╬╬╬╬╬╣╔╣╬╬╬╬╣╓╦   ╬╬╬╬╬╬╣  ╬╬╬╬╬╬╬╬╬
╟╬╬╬╬╬╬╬╬  ╠╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╗  ╬╬╬╬╬╬╣  ╬╬╬╬╬╬╬╬╬
╟╬╬╬╬╬╬╬╬  ╠╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╗  ╬╬╬╬╬╬╣  ╬╬╬╬╬╬╬╬╬
╟╬╬╬╬╬╬╬╬  ╞╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬═  ╬╬╬╬╬╬╣  ╬╬╬╬╬╬╬╬╬
╟╬╬╬╬╬╬╬╬╗  ╫╬╬╬╬╬╬╬╬╬╬╬╬╬╝  ╠╬╬╬╬╬╜    ╙╬╬╬╬╬╬╬
╟╬╬╬╬╬╬╬╬╬╗  ╙╣╬╬╬╬╬╬╬╬╬╣╙  ╗╬╬╬╬╬╜  ╣╣  ║╬╬╬╬╬╬
╟╬╬╬╬╬╬╬╬╬╬╣╖   ╙╙╨╝╨╜╙   ╔╣╬╬╬╬╬╬╣     ┌╣╬╬╬╬╬╬
╟╬╬╬╬╬╬╬╬╬╬╬╬╬╣╗╖    ┌╖╗╣╬╬╬╬╬╬╬╬╬╬╬╣╣╣╣╬╬╬╬╬╬╬╬
╠╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╣
 ╙╣╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╬╣╨  
`;

const outputTackleboxLogo = () => {
  console.log(chalk.hex("#355C7D").bold(logo));
  console.log(
    "\nDeploying Tacklebox webhook service infrastructure.  This may take 20+ minutes.\n"
  );
};

module.exports = outputTackleboxLogo;
