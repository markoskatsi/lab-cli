const logger = require("../logger")("commands:route-add");

async function cfRequest(config, method, body) {
  const api = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/cfd_tunnel/${config.tunnelId}/configurations`;

  const response = await fetch(api, {
    method,
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      "Content-Type": "application/json",
    },
    body: body && JSON.stringify(body),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(
      `Cloudflare API request failed (${response.status} ${response.statusText}): ${text}`,
    );
  }
  return text ? JSON.parse(text) : undefined;
}

module.exports = async function routeAdd(config, serviceName) {
  logger.highlight("  Adding route  ");

  const service = config.services[serviceName];
  if (!service) {
    logger.warning(`Unknown service "${serviceName}". Known services:
  ${Object.keys(config.services).join(", ")}`);
    process.exit(1);
  }

  try {
    const { result } = await cfRequest(config, "GET");
    const { ingress } = result.config;
    const hostname = `${serviceName}.${config.domain}`;
    const rule = { hostname, service: `http://localhost:${service.port}` };

    const existing = ingress.findIndex((r) => r.hostname === hostname);
    if (existing === -1) {
      ingress.splice(ingress.length - 1, 0, rule); // insert before the catch-all rule
    } else {
      ingress[existing] = rule;
    }

    await cfRequest(config, "PUT", { config: result.config });
    logger.log(`Routed ${hostname} -> localhost:${service.port}`);
  } catch (error) {
    logger.warning("Failed to add route", error);
    process.exit(1);
  }
};
