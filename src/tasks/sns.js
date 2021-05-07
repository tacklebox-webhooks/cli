const { Observable } = require("rxjs");

const build = () => {
  return new Observable((observer) => {
    observer.next("Configuring");

    setTimeout(() => {
      observer.next("Deploying");
    }, 2000);

    setTimeout(() => {
      observer.complete();
    }, 6000);
  });
};

const teardown = () => {
  return new Observable((observer) => {
    observer.next("Disconnecting");

    setTimeout(() => {
      observer.next("Cleaning up");
    }, 2000);

    setTimeout(() => {
      observer.complete();
    }, 6000);
  });
};

module.exports.build = build;
module.exports.teardown = teardown;
