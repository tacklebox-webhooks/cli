const { Observable } = require("rxjs");
const { exec } = require("child_process");

const command = `cd src &&
  rm -rf ui &&
  git clone https://github.com/hook-captain/management-ui.git ui &&
  cd ui &&
  rm -rf .git &&
  cd client &&
  npm install &&
  cd ../server &&
  npm install`;

const installUIDependencies = () => {
  return new Observable((observer) => {
    observer.next("Importing Tacklebox UI code");
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

module.exports = installUIDependencies;
