const swcrc = require('./swcrc.json');
const runIndex = process.argv.findIndex((f) => f === '--run')
if (runIndex < 0) throw new Error('--run is missing');
const script = process.argv[runIndex + 1];

require('@swc/register')(swcrc);

require(`./${script}`);
