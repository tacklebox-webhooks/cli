const { Observable } = require("rxjs");
const { exec } = require("child_process");

const command = "cd src && rm -rf infrastructure";

const removeDependencies = () => {
  return new Observable((observer) => {
    observer.next("Removing AWS component code");
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

module.exports = removeDependencies;
