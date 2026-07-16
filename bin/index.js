#!/usr/bin/env node
const logger = require("../src/logger")("bin");
const arg = require("arg");
const chalk = require("chalk");
const getConfig = require("../src/config/config-mgr");
const containerUp = require("../src/commands/container-up");
const containerDown = require("../src/commands/container-down");
const routeAdd = require("../src/commands/route-add");
const routeRemove = require("../src/commands/route-remove");

try {
  const args = arg({});
  const config = getConfig();

  const [noun, verb, service] = args._;
  const command = `${noun} ${verb}`;

  logger.debug("Received args", args);

  if (command === "container up") {
    containerUp(config, service);
  } else if (command === "container down") {
    containerDown(config, service);
  } else if (command === "route add") {
    routeAdd(config, service);
  } else if (command === "route remove") {
    routeRemove(config, service);
  } else {
    logger.warning(`Unknown command ${command}`);
    usage();
  }
} catch (e) {
  logger.warning(e.message);
  console.log();
  usage();
}

function usage() {
  console.log(`${chalk.whiteBright("lab [CMD]")}
    ${chalk.greenBright("container up".padEnd(18))}Brings up the container
    ${chalk.greenBright("container down".padEnd(18))}Brings down the container
    ${chalk.greenBright("route add".padEnd(18))}Adds a route and dns record for a service
    ${chalk.greenBright("route remove".padEnd(18))}Removes a route and dns record for a service
  `);
}
