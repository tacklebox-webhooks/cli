const { Observable } = require("rxjs");
const fs = require("fs");
const {
  APIGatewayClient,
  GetApiKeyCommand,
} = require("@aws-sdk/client-api-gateway");

const client = new APIGatewayClient();

const populateUiEnv = () => {
  return new Observable((observer) => {
    observer.next("Extracting environment data");
    const apiData = extractApiData();
    writeApiDataToEnv(apiData, observer);
  });
};

const extractApiData = () => {
  const fileData = fs.readFileSync("src/infrastructure/outputs.json", "utf8");
  const json = JSON.parse(fileData);
  return json.Tacklebox;
};

const writeApiDataToEnv = (apiData, observer) => {
  observer.next("Translating environment data");
  const { apiUrl, apiKeyId } = apiData;
  const command = new GetApiKeyCommand({
    apiKey: apiKeyId,
    includeValue: true,
  });
  client.send(command, (err, data) => {
    observer.next("Injecting environment variables");
    const apiKey = data.value;
    updateOutputFile(apiData, apiKey);
    writeEnvFile(apiUrl, apiKey);
    observer.complete();
  });
};

const updateOutputFile = (apiData, apiKey) => {
  const filepath = "src/infrastructure/outputs.json";
  const updatedData = { ...apiData, apiKey };
  const fileContent = JSON.stringify({ Tacklebox: updatedData }, null, 2);
  fs.writeFileSync(filepath, fileContent);
};

const writeEnvFile = (apiUrl, apiKey) => {
  const filepath = "src/ui/client/.env";
  const fileContent = `REACT_APP_HOST=${apiUrl}\nREACT_APP_API_KEY=${apiKey}`;
  fs.writeFile(filepath, fileContent, (err) => {
    if (err) throw err;
  });
};

module.exports = populateUiEnv;
