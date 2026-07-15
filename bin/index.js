#!/usr/bin/env node
const logger = require("../src/logger")("bin");
const arg = require("arg");
const chalk = require("chalk");
const getConfig = require("../src/config/config-mgr");
const start = require("../src/commands/start");
const containerUp = require("../src/commands/container-up");

try {
  const args = arg({
    "--start": Boolean,
    "--build": Boolean,
    "--container-up": Boolean,
  });

  logger.debug("Received args", args);

  if (args["--start"]) {
    const config = getConfig();
    start(config);
  }
  if (args["--container-up"]) {
    const config = getConfig();
    containerUp(config);
  }
} catch (e) {
  logger.warning(e.message);
  console.log();
  usage();
}

function usage() {
  console.log(`${chalk.whiteBright("lab [CMD]")}
  ${chalk.greenBright("--start")}\tStarts the app
  ${chalk.greenBright("--container-up")}\tBrings up the container`);
}
