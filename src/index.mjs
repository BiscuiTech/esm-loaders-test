import { fromCJS } from "./cjs.js";
import { fromTS } from "./ts.ts";
import { fromESM } from "./esm.mjs";
import { fromESMLike } from "./esm-like.js";

console.log("test");

function main() {
  // CJS
  const cjs = fromCJS();
  console.log(`From CJS: ${cjs}`);

  // TS
  const ts = fromTS();
  console.log(`From TS: ${ts}`);

  // ESM
  const esm = fromESM();
  console.log(`From ESM: ${esm}`);

  // ESM-Like
  const esmLike = fromESMLike();
  console.log(`From ESMLike: ${esmLike}`);
}

main();
