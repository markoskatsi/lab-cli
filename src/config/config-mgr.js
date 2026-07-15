const os = require('os');
const path = require('path');
const fs = require('fs');
const logger = require('../logger')('config:mgr');
const schema = require('./schema.json');
const betterAjvErrors = require('better-ajv-errors');
const Ajv = require('ajv').default;
const ajv = new Ajv({ jsonPointers: true });
const configPath = path.join(os.homedir(), '.config', 'lab', 'config.json');

module.exports = function getConfig() {
  if (!fs.existsSync(configPath)) {
    logger.warning(`Could not find configuration at ${configPath}, using default`);
    return { port: 1234 };
  } else {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const isValid = ajv.validate(schema, config);
    if (!isValid) {
      logger.warning('Invalid configuration was supplied');
      console.log();
      console.log(betterAjvErrors(schema, config, ajv.errors));
      process.exit(1);
    }
    logger.debug('Found configuration', config);
    return config;
  }
}
