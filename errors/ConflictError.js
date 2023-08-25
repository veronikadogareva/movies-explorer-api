const { CONFLICT } = require('../helpers/statuses');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT;
  }
}

module.exports = ConflictError;
