const chalk = require("chalk");
const debug = require("debug");

module.exports = function createLogger(name) {
  return {
    log: (...args) => console.log(chalk.gray(...args)),
    warning: (...args) => console.log(chalk.yellow(...args)),
    highlight: (...args) => console.log(chalk.bgCyanBright(...args)),
    success: (...args) => console.log(chalk.green(...args)),
    debug: debug(name),
  };
};
