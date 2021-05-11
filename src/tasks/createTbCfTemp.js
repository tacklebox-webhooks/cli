const { Observable } = require("rxjs");
const { exec } = require("child_process");

const command = "cd src/infrastructure && cdk synth";

const createCloudFormationTemplate = () => {
  return new Observable((observer) => {
    observer.next("Creating Cloud Formation template");
    exec(command, (error, stdout, stderr) => {
      if (error) {
        throw new Error(error.message);
      }

      observer.next("Finalizing Cloud Formation template");
      setTimeout(() => {
        observer.complete();
      }, 2000);
    });
  });
};

module.exports = createCloudFormationTemplate;
