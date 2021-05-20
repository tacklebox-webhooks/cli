const { Observable } = require("rxjs");
const { exec } = require("child_process");

const command = `cd src/infrastructure &&
  git clone https://github.com/tacklebox-webhooks/webhook-service.git toRemove &&
  mv toRemove/lambdas lambdas &&
  rm -rf toRemove &&
  npm install`;

const importTbCode = () => {
  return new Observable((observer) => {
    observer.next("Importing AWS Lambda modules");
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
