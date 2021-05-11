const { Observable } = require("rxjs");
const { exec } = require("child_process");

const command = "cd src/ui && ????????"; // need to figure out what to do here

const destroyUI = () => {
  return new Observable((observer) => {
    observer.next("Tearing down management UI");
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

module.exports = destroyUI;
