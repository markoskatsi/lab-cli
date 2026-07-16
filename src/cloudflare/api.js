const API = "https://api.cloudflare.com/client/v4";

async function request(config, path, { method = "GET", body } = {}) {
  const response = await fetch(`${API}${path}`, {
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

const tunnel = (config) =>
  `/accounts/${config.accountId}/cfd_tunnel/${config.tunnelId}/configurations`;
const dns = (config) => `/zones/${config.zoneId}/dns_records`;

module.exports = {
  getTunnelConfig: (config) => request(config, tunnel(config)),

  putTunnelConfig: (config, tunnelConfig) =>
    request(config, tunnel(config), {
      method: "PUT",
      body: { config: tunnelConfig },
    }),

  createDnsRecord: (config, body) =>
    request(config, dns(config), { method: "POST", body }),
};
