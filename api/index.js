const server = require('../local-server');

module.exports = (req, res) => {
  if (req.headers['x-matched-path']) {
    req.url = req.headers['x-matched-path'];
  }
  server.emit('request', req, res);
};
