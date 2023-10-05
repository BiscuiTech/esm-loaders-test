const packageJson = require("../package.json");

function fromCJSLike() {
  return packageJson.version;
}

module.exports = {
  fromCJSLike,
};
