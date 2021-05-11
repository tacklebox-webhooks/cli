const { Observable } = require("rxjs");
const { exec } = require("child_process");

const command = "cd src/infrastructure && cdk deploy";

const deployInfrastructure = () => {
  return new Observable((observer) => {
    observer.next("Deploying infrastructure");
    exec(command, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error.message);
      }

      observer.next("Finalizing deployment");
      setTimeout(() => {
        observer.complete();
      }, 2000);
    });
  });
};

module.exports = deployInfrastructure;
