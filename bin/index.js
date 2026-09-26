#!/usr/bin/env node
const logger = require("../src/logger")("bin");
const arg = require("arg");
const chalk = require("chalk");
const getConfig = require("../src/config/config-mgr");
const containerUp = require("../src/commands/container-up");
const containerDown = require("../src/commands/container-down");
const routeAdd = require("../src/commands/route-add");
const routeRemove = require("../src/commands/route-remove");
const repoClone = require("../src/commands/repo-clone");
const repoRemove = require("../src/commands/repo-remove");

const commands = {
  "container up": containerUp,
  "container down": containerDown,
  "route add": routeAdd,
  "route remove": routeRemove,
  "repo clone": repoClone,
  "repo remove": repoRemove,
};

try {
  const args = arg({});
  const config = getConfig();

  const [noun, verb, service] = args._;
  const command = `${noun} ${verb}`;

  logger.debug("Received args", args);

  const handler = commands[command];
  if (!handler) {
    logger.warning(`Unknown command "${command}"`);
    console.log();
    usage();
    process.exit(1);
  }
  handler(config, service);
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
    ${chalk.greenBright("repo clone".padEnd(18))}Clones a service's repository on the server
    ${chalk.greenBright("repo remove".padEnd(18))}Removes a service's cloned repository from the server
  `);
}
