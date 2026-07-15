const logger = require("../logger")("commands:container-down");
const { execSync } = require("child_process");

module.exports = function containerDown(config, serviceName) {
  logger.highlight("  Bringing down the container  ");

  const service = config.services[serviceName];
  if (!service) {
    logger.warning(`Unknown service "${serviceName}". Known services:
  ${Object.keys(config.services).join(", ")}`);
    process.exit(1);
  }

  try {
    logger.debug(
      `Connecting to ${config.sshHost} and running command in ${service.path}`,
    );
    const output = execSync(
      `ssh ${config.sshHost} "cd ${service.path} && docker-compose down"`,
    );
    logger.debug("Command output:", output.toString());
  } catch (error) {
    logger.warning("Failed to connect to the server via SSH", error);
    process.exit(1);
  }
};
