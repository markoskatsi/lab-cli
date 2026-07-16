#!/usr/bin/env node
const logger = require("../src/logger")("bin");
const arg = require("arg");
const chalk = require("chalk");
const getConfig = require("../src/config/config-mgr");
const containerUp = require("../src/commands/container-up");
const containerDown = require("../src/commands/container-down");

try {
  const args = arg({});
  const [noun, ...rest] = args._;

  logger.debug("Received args", args);

  if (noun === "container") {
    const [verb, service] = rest;
    if (verb === "up") {
      const config = getConfig();
      containerUp(config, service);
    } else if (verb === "down") {
      const config = getConfig();
      containerDown(config, service);
    } else {
      logger.warning(`Unknown verb ${verb}`);
      usage();
    }
  } else {
    logger.warning(`Unknown command ${noun}`);
    usage();
  }
} catch (e) {
  logger.warning(e.message);
  console.log();
  usage();
}

function usage() {
  console.log(`${chalk.whiteBright("lab [CMD]")}
    ${chalk.greenBright("container up")}\tBrings up the container
    ${chalk.greenBright("container down")}\tBrings down the container`);
}
