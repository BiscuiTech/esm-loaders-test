const packageJson = require('./package.json');

function fromCJS(){
  return packageJson.version
}

module.exports = {
  fromCJS
}