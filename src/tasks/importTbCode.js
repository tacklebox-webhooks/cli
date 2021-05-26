const { Observable } = require("rxjs");
const { exec } = require("child_process");

const command = `cd src &&
  git clone https://github.com/tacklebox-webhooks/WHaaS-CDK.git infrastructure &&
  cd infrastructure &&
  rm -rf .git`;

const importTbCode = () => {
  return new Observable((observer) => {
    observer.next("Importing AWS CDK modules");
    exec(command, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error.message);
      }

      observer.next("Installing dependencies");
      setTimeout(() => {
        observer.complete();
      }, 2000);
    });
  });
};

module.exports = importTbCode;
