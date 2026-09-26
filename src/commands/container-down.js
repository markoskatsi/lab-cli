const logger = require("../logger")("commands:container-down");
const { getService } = require("../utils/services");
const { execSync } = require("child_process");

module.exports = function containerDown(config, serviceName) {
  logger.highlight("  Bringing down the container  ");

  const service = getService(config, serviceName);

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
