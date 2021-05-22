const fs = require("fs");
const chalk = require("chalk");

const logo = `
            -sdmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmds-
            dmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmd            
            mmmmmmdsymmmmmmmmho/---/ohmmmmmmmmmm            
            mmmmm/.o:-mmmmmy-:sdmmmhs:-ymmmmmmmm            
            mmmmmo./-/mmmmo.hmmmmmmmmmy\`smmmmmmm            
            mmmmmmh ommmmh smmmmmmmmmmmo\`dmmmmmm            
            mmmmmmd ommmmh smmmmmmmmmmmo dmmmmmm            
            mmmmmmd ommmmh smmmmmmmmmmmo dmmmmmm            
            mmmmmmd ommmmh -ymmmmshmmmmo dmmmmmm            
            mmmmmmd ommmmh+dmmmy- hmmmmo dmmmmmm            
            mmmmmmd ommmmmmmmmmms hmmmmo dmmmmmm            
            mmmmmmd ommmmmmmmmmms hmmmmo dmmmmmm            
            mmmmmmd ommmmmmmmmmms hmmmmo dmmmmmm            
            mmmmmmm/.dmmmmmmmmmd-:mmmmo..-ymmmmm            
            mmmmmmmm+.odmmmmmdo.+mmmmm./h:-mmmmm            
            mmmmmmmmmds:::::::sdmmmmmmdo+sdmmmmm            
            mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm            
            :hmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmh:`;

const outputTackleboxLogo = () => {
  console.log(chalk.hex("#355C7D").bold(logo));
  console.log(
    "\nDeploying Tacklebox webhook service infrastructure.  This may take 20+ minutes.\n"
  );
};

module.exports = outputTackleboxLogo;
