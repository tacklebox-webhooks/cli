const fs = require("fs");
const boxen = require("boxen");
const chalk = require("chalk");

const outputTackleboxInfo = () => {
  const { apiUrl, apiKey } = extractInfo();
  console.log("\nYour webhook service is now deployed in AWS.\n");

  const coloredApiUrl = chalk.hex("#C06C84").bold(apiUrl);
  const colordApiKey = chalk.hex("#C06C84").bold(apiKey);
  const formattedApiUrl = boxen(
    `API Host: ${coloredApiUrl}\n\nAPI Key: ${coloredApiKey}`,
    {
      borderColor: "#355C7D",
      padding: 1,
      margin: { top: 1, right: 1, bottom: 1, left: 0 },
      borderStyle: "double",
    }
  );
  console.log(formattedApiUrl, "\n");
};

const extractInfo = () => {
  const fileData = fs.readFileSync("src/infrastructure/outputs.json", "utf8");
  const json = JSON.parse(fileData);
  return json.Tacklebox;
};

module.exports = outputTackleboxInfo;
