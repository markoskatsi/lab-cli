const logger = require("../logger")("commands:route-remove");
const {
  getTunnelConfig,
  putTunnelConfig,
  findDnsRecord,
  deleteDnsRecord,
} = require("../cloudflare/api");

module.exports = async function routeRemove(config, serviceName) {
  logger.highlight("  Removing route  ");

  const service = config.services[serviceName];
  if (!service) {
    logger.warning(`Unknown service "${serviceName}". Known services:
  ${Object.keys(config.services).join(", ")}`);
    process.exit(1);
  }

  const hostname = service.domain;
  const target = `${config.tunnelId}.cfargotunnel.com`;

  try {
    const { result } = await getTunnelConfig(config);
    const { ingress } = result.config;
    const existing = ingress.findIndex((r) => r.hostname === hostname);

    const { result: records } = await findDnsRecord(config, hostname);
    const record = records.find((r) => r.content === target);

    if (existing === -1 && !record) {
      logger.warning(`Nothing to remove for ${hostname}`);
      return;
    }

    if (records.length && !record) {
      logger.warning(
        `Leaving DNS record for ${hostname}, it does not point at this tunnel`,
      );
    }

    if (record) {
      await deleteDnsRecord(config, record.id);
      logger.log(`DNS record removed for ${hostname}`);
    }

    if (existing !== -1) {
      ingress.splice(existing, 1);
      await putTunnelConfig(config, result.config);
      logger.log(`Removed route ${hostname}`);
    }
  } catch (error) {
    logger.warning("Failed to remove route", error);
    process.exit(1);
  }
};
