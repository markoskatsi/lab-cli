const logger = require("../logger")("commands:container-up");
const { execSync } = require("child_process");

module.exports = function containerUp(config) {
  logger.highlight("  Bringing up the container  ");

  try {
    logger.debug("Connecting to the server via SSH...");
    const output = execSync(`ssh ${config.sshHost} "echo hello"`);
    logger.debug("SSH connection successful", output);
  } catch (error) {
    logger.warning("Failed to connect to the server via SSH", error);
    process.exit(1);
  }
  
};
