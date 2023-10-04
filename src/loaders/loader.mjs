import { processJavascriptFile } from "./javascript.mjs";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

import { isBuiltin } from "node:module";
import { dirname } from "node:path";

import resolveCallback from "resolve/async.js";

const resolveAsync = promisify(resolveCallback);
const baseURL = pathToFileURL(process.cwd() + "/").href;

// export async function resolve(specifier, context, next) {
//   const { parentURL = baseURL } = context;

//   if (specifier.startsWith("node:")) {
//     specifier = specifier.slice(5);
//   }

// if (isBuiltin(specifier)) {
//   return next(specifier, context);
// }

// // `resolveAsync` works with paths, not URLs
// if (specifier.startsWith("file://")) {
//   // eslint-disable-next-line no-param-reassign
//   specifier = fileURLToPath(specifier);
// }
// const parentPath = fileURLToPath(parentURL);

// let url;
// try {
//   const resolution = await resolveAsync(specifier, {
//     basedir: dirname(parentPath),
//     // For whatever reason, --experimental-specifier-resolution=node doesn't search for .mjs extensions
//     // but it does search for index.mjs files within directories
//     extensions: [".js", ".json", ".node", ".mjs", ".ts", ".tsx", ".cjs"],
//   });
//   url = pathToFileURL(resolution).href;
// } catch (/** @type {any} */ error) {
//   if (error?.code === "MODULE_NOT_FOUND") {
//     // Match Node's error code
//     error.code = "ERR_MODULE_NOT_FOUND";
//   }
//   throw error;
// }

// return next(url, context);
// }

/**
 *
 * @param {string} url
 * @param {*} context
 * @param {*} nextLoad
 * @returns
 */
export async function load(url, context, nextLoad) {
  if (/\.[mc]?(ts|js)x?$/.test(url)) {
    return processJavascriptFile(url, context, nextLoad);
  }

  // // Assume files without extension (e.g. tsc) are 'commonjs'
  // eslint-disable-next-line no-param-reassign
  // context.format ||= "commonjs";

  // Let Node.js handle all other URLs.
  return nextLoad(url, context);
}
