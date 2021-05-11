const { Observable } = require("rxjs");
const { exec } = require("child_process");

const command = `cd src &&
  git clone https://github.com/hook-captain/WHaaS-CDK.git infrastructure &&
  cd infrastructure &&
  rm -rf .git &&
  npm install`;

const installDependencies = () => {
  return new Observable((observer) => {
    observer.next("Importing AWS component code");
    exec(command, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error.message);
      }

      observer.next("Packaging");
      setTimeout(() => {
        observer.complete();
      }, 2000);
    });
  });
};

module.exports = installDependencies;
