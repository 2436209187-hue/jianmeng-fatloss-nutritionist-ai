const app = require("../backend/dist/index.js").default;

module.exports = (req, res) => {
  return app(req, res);
};
