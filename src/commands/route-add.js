const logger = require("../logger")("commands:route-add");
const {
  getTunnelConfig,
  putTunnelConfig,
  createDnsRecord,
} = require("../cloudflare/api");

module.exports = async function routeAdd(config, serviceName) {
  logger.highlight("  Adding route  ");

  const service = config.services[serviceName];
  if (!service) {
    logger.warning(`Unknown service "${serviceName}". Known services:
  ${Object.keys(config.services).join(", ")}`);
    process.exit(1);
  }

  try {
    const { result } = await getTunnelConfig(config);
    const { ingress } = result.config;
    const hostname = `${service.domain}`;
    const rule = { hostname, service: `http://localhost:${service.port}` };

    const existing = ingress.findIndex((r) => r.hostname === hostname);
    if (existing === -1) {
      ingress.splice(ingress.length - 1, 0, rule); // insert before the catch-all rule
    } else {
      ingress[existing] = rule;
    }

    await putTunnelConfig(config, result.config);
    logger.log(`Routed ${hostname} -> localhost:${service.port}`);
    
    await createDnsRecord(config, {
      type: "CNAME",
      name: hostname,
      content: `${config.tunnelId}.cfargotunnel.com`,
      proxied: true,
      ttl: 1,
    });

    logger.log(`DNS record added for ${hostname}`);
  } catch (error) {
    logger.warning("Failed to add route", error);
    process.exit(1);
  }
};
