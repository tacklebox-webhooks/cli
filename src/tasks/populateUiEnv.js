const fs = require("fs");
const {
  APIGatewayClient,
  GetApiKeyCommand,
} = require("@aws-sdk/client-api-gateway");

const client = new APIGatewayClient();

const populateUiEnv = () => {
  const { apiUrl, apiKeyId } = extractApiData();
  const apiKey = getApiKey(apiKeyId);
  writeEnvFile(apiUrl, apiKey);
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
