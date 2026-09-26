const logger = require("../logger")("commands:remove-repo");
const { execSync } = require("child_process");

module.exports = function removeRepo(config, serviceName) {
  logger.highlight("  Removing the repository  ");

  const service = config.services[serviceName];
  if (!service) {
    logger.warning(`Unknown service "${serviceName}". Known services:
  ${Object.keys(config.services).join(", ")}`);
    process.exit(1);
  }

  try {
    logger.debug(
      `Connecting to ${config.sshHost} and checking for the repo in ${config.projectsPath}`,
    );
    const remote = `dir=${config.projectsPath}/$(basename ${service.repo} .git); if [ -d $dir/.git ]; then rm -rf $dir; echo REMOVED; else echo NOT_FOUND; fi`;
    const output = execSync(`ssh ${config.sshHost} "${remote}"`).toString();
    logger.debug("Command output:", output);

    if (output.includes("REMOVED")) {
      logger.log(`Removed ${service.repo} from ${config.projectsPath}`);
    } else {
      logger.log(
        `No repository found in ${config.projectsPath}, nothing to remove`,
      );
    }
  } catch (error) {
    logger.warning("Failed to connect to the server via SSH", error);
    process.exit(1);
  }
};
