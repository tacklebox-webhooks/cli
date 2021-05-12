const { Observable } = require("rxjs");
const fs = require("fs");
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

const client = new LambdaClient();

const populateDb = () => {
  return new Observable((observer) => {
    observer.next("Populating db with basic tables");
    const lambdaArn = extractLambdaArn();
    runPopulateDbLambda(lambdaArn);
    observer.complete();
  });
};

const extractLambdaArn = () => {
  const fileData = fs.readFileSync("src/infrastructure/outputs.json", "utf8");
  const json = JSON.parse(fileData);
  const stackData = json.Tacklebox;
  return stackData.dbSetupLambda;
};

const runPopulateDbLambda = async (lambdaArn) => {
  const command = new InvokeCommand({
    FunctionName: lambdaArn,
    InvocationType: "Event",
  });
  client.send(command);
};

module.exports = populateDb;
