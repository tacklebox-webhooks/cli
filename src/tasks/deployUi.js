const { Observable } = require("rxjs");
const { exec } = require("child_process");

const command = "cd src/ui && ?????????"; // need to figure out what this is

const deployManagementUI = () => {
  return new Observable((observer) => {
    observer.next("Deploying management UI");
    exec(command, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error.message);
      }

      observer.next("Finalizing deployment");
      setTimeout(() => {
        observer.complete();
      }, 1000);
    });
  });
};

module.exports = deployManagementUI;
