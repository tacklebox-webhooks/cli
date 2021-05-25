const { Observable } = require("rxjs");
const fs = require("fs");
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

const client = new LambdaClient();

const populateDb = () => {
  return new Observable((observer) => {
    observer.next("Populating db with basic tables");
    const lambdaArn = extractLambdaArn();
    setTimeout(() => {
      runPopulateDbLambda(lambdaArn)
        .then((response) => {
          observer.complete();
        })
        .catch((err) => {
          console.error(err);
        });
    }, 5000);
  });
};

const extractLambdaArn = () => {
  const fileData = fs.readFileSync("src/infrastructure/outputs.json", "utf8");
  const json = JSON.parse(fileData);
  const stackData = json.Tacklebox;
  return stackData.setupDbLambda;
};

const runPopulateDbLambda = async (lambdaArn) => {
  const command = new InvokeCommand({
    FunctionName: lambdaArn,
    InvocationType: "Event"
  });
  const response = await client.send(command);
  return response;
};

module.exports = populateDb;
