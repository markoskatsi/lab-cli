const logger = require("../logger")("commands:deploy-backend");
const { getService } = require("../utils/services");
const repoClone = require("./repo-clone");
const containerUp = require("./container-up");
const routeAdd = require("./route-add");

module.exports = async function deployBackend(config, serviceName) {
  logger.highlight("  Deploying the backend  ");

  getService(config, serviceName);

  try {
    repoClone(config, serviceName);
    
    containerUp(config, serviceName);
    await routeAdd(config, serviceName);
  } catch (error) {
    logger.warning("Failed to deploy the backend", error);
    process.exit(1);
  }
  logger.success("Backend deployed successfully");
};
