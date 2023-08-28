const { FORBIDDEN } = require('../helpers/statuses');

class ProhibitionError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN;
  }
}

module.exports = ProhibitionError;
