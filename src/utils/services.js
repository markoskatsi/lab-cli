const logger = require("../logger")("utils:services");

function getService(config, serviceName) {
  const service = config.services[serviceName];
  if (!service) {
    logger.warning(`Unknown service "${serviceName}". Known services:
  ${Object.keys(config.services).join(", ")}`);
    process.exit(1);
  }
  return service;
}

module.exports = { getService };
