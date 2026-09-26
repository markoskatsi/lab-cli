const logger = require("../logger")("commands:clone-repo");
const { execSync } = require("child_process");

module.exports = function repoClone(config, serviceName) {
  logger.highlight("  Cloning the repository  ");

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
    const remote = `dir=${config.projectsPath}/$(basename ${service.repo} .git); if [ -d $dir/.git ]; then echo LAB_ALREADY_CLONED; else mkdir -p ${config.projectsPath} && cd ${config.projectsPath} && git clone ${service.repo}; fi`;
    const output = execSync(`ssh ${config.sshHost} "${remote}"`).toString();
    logger.debug("Command output:", output);

    if (output.includes("LAB_ALREADY_CLONED")) {
      logger.log(
        `Repository already cloned in ${config.projectsPath}, skipping`,
      );
    } else {
      logger.log(`Cloned ${service.repo} into ${config.projectsPath}`);
    }
  } catch (error) {
    logger.warning("Failed to connect to the server via SSH", error);
    process.exit(1);
  }
};
