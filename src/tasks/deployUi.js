const { Observable } = require("rxjs");
const { exec } = require("child_process");

const command = null; // need to figure out this command;

const deployUI = () => {
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

module.exports = deployUI;
