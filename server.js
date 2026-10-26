// Server entry point for local execution
module.exports = require('./local-server');
if (require.main === module) {
  require('./local-server');
}
