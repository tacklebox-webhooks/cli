const { Observable } = require("rxjs");
const { exec } = require("child_process");

const command = "cd src/ui && npm run build";

const buildUI = () => {
  return new Observable((observer) => {
    observer.next("Creating static UI build");
    exec(command, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error.message);
      }

      observer.next("Finalizing");
      setTimeout(() => {
        observer.complete();
      }, 1000);
    });
  });
};

module.exports = buildUI;
