import { register } from "node:module";

register("./src/loaders/name-resolution-loader.mjs", import.meta.url);
register("./src/loaders/loader.mjs", import.meta.url);
// register("./src/loaders/json-loader.mjs", import.meta.url);
