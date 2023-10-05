// import { fromCJSLike } from "./cjs-like.js";
import { fromCJS } from "./cjs.cjs";
import { fromESM } from "./esm.mjs";
import { fromTS } from "./ts";
import { fromESMLike } from "./esm-like";

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
