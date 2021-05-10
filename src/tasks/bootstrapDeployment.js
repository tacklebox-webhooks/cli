const { Observable } = require("rxjs");
const { exec } = require("child_process");

const bootstrapDeployment = () => {
  return new Observable((observer) => {
    observer.next("Bootstrapping deployment");
    exec("cd src/infrastructure && cdk bootstrap", (error, stdout, stderr) => {
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
