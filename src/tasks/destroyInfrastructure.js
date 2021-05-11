const { Observable } = require("rxjs");
const { exec } = require("child_process");

const command = "cd src/infrastructure && cdk destroy -f";

const destroyInfrastructure = () => {
  return new Observable((observer) => {
    observer.next("Tearing down deployment");
    exec(command, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error.message);
      }

      observer.next("Cleaning up");
      setTimeout(() => {
        observer.complete();
      }, 2000);
    });
  });
};

module.exports = destroyInfrastructure;
