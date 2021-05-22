const fs = require("fs");
const boxen = require("boxen");
const chalk = require("chalk");

const outputTackleboxUrl = () => {
  const apiUrl = extractUrl();
  const mainUrlMessage =
    "Your webhook service is now deployed and its API host is:";
  const coloredApiUrl = chalk.hex("#C06C84").bold(apiUrl);
  const formattedApiUrl = boxen(coloredApiUrl, {
    borderColor: "#355C7D",
    padding: 1,
    margin: { top: 1, right: 1, bottom: 1, left: 0 },
    borderStyle: "double",
  });

  console.log("\n", mainUrlMessage, "\n", formattedApiUrl);
};

const extractUrl = () => {
  const fileData = fs.readFileSync("src/infrastructure/outputs.json", "utf8");
  const json = JSON.parse(fileData);
  const { apiUrl } = json.Tacklebox;
  return apiUrl;
};

module.exports = outputTackleboxUrl;
