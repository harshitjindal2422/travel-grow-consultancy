const server = require('../local-server');

module.exports = (req, res) => {
  server.emit('request', req, res);
};
