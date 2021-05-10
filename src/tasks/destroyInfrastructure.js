const { Observable } = require("rxjs");
const { exec } = require("child_process");

const destroyInfrastructure = () => {
  return new Observable((observer) => {
    observer.next("Tearing down deployment");
    exec("cd src/infrastructure && cdk destroy -f", (error, stdout, stderr) => {
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
