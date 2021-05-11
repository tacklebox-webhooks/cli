const { Observable } = require("rxjs");
const { exec } = require("child_process");

const command = "cd src/infrastructure && cdk bootstrap";

const bootstrapDeployment = () => {
  return new Observable((observer) => {
    observer.next("Bootstrapping deployment");
    exec(command, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error.message);
      }

      observer.next("Finalizing");
      setTimeout(() => {
        observer.complete();
      }, 2000);
    });
  });
};

module.exports = bootstrapDeployment;
