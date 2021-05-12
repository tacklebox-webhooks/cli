const fs = require("fs");
const {
  APIGatewayClient,
  GetApiKeyCommand,
} = require("@aws-sdk/client-api-gateway");

const client = new APIGatewayClient();

const populateUiEnv = () => {
  return new Observable((observer) => {
    observer.next("Extracting environment data");
    const { apiUrl, apiKeyId } = extractApiData();
    observer.next("Translating environment data");
    const apiKey = getApiKey(apiKeyId);
    observer.next("Injecting environment variables");
    writeEnvFile(apiUrl, apiKey);
    observer.complete();
  });
};

const extractApiData = () => {
  const fileData = fs.readFileSync("src/infrastructure/outputs.json", "utf8");
  const json = JSON.parse(fileData);
  return json.Tacklebox;
};

const getApiKey = async (id) => {
  const command = new GetApiKeyCommand({ apiKey: id, includeValue: true });
  client.send(command, (err, data) => data.value);
};

const writeEnvFile = (apiUrl, apiKey) => {
  const filepath = "src/ui/.env";
  const fileContent = `REACT_APP_HOST=${apiUrl}\nREACT_APP_API_KEY=${apiKey}`;

  fs.writeFile(filepath, fileContent, (err) => {
    if (err) throw err;
  });
};

module.exports = populateUiEnv;
