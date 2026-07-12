try {
  const app = require("../backend/src/index").default;

  module.exports = async (req, res) => {
    try {
      return app(req, res);
    } catch (e) {
      res.status(500).json({ error: "RUNTIME_ERROR", message: e.message, stack: e.stack });
    }
  };
} catch (e) {
  module.exports = (req, res) => {
    res.status(500).json({ error: "LOAD_ERROR", message: e.message, stack: e.stack });
  };
}
