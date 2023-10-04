import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { transform } from "@swc/core";
import { dirname, extname, resolve as resolvePath } from "node:path";

const typescriptExtension = /\.m?tsx?$/;

/**
 *
 * @param {string} url
 * @param {*} context
 * @param {*} nextLoad
 * @returns
 */
export async function processJavascriptFile(url, context, nextLoad) {
  console.log(`Processing ${url}`);
  // const rawSource = readFileSync(fileURLToPath(url), "utf-8");
  let format = "module"; //await getPackageType(url);
  const nextloaded = await nextLoad(url, { ...context, format: "module" }).then(
    (result) => {
      if (containsCJS(result.source)) {
        // throw new Error("CommonJS");
        return {
          ...result,
          format: "commonjs",
        };
      }
      return result;
    }
  );
  // .catch(async (err) => {
  //   console.log("err", err);
  //   if (
  //     (err?.message.includes("require") && err.includes("import")) ||
  //     err?.message.includes("CommonJS")
  //   ) {
  //     return { format: "commonjs" };
  //   }

  //   throw err;
  // });

  const rawSource = Buffer.from(nextloaded.source).toString("utf-8");
  console.log({
    rawSource,
    nextloaded,
  });
  const payload = await transform(rawSource, {
    filename: url,
    jsc: {
      // target: "es2018",
      parser: {
        // syntax: typescriptExtension.test(url) ? "typescript" : "ecmascript",
        syntax: "typescript",
        decorators: true,
        dynamicImport: true,
        importAssertions: true,
        // ...(typescriptExtension.test(url) ? { tsx: true } : { jsx: true }),
      },
      // transform: {
      //   react: {
      //     runtime: "automatic",
      //   },
      //   legacyDecorator: typescriptExtension.test(url) ? false : true,
      //   decoratorMetadata: typescriptExtension.test(url) ? true : false,
      // },
      experimental: {
        keepImportAttributes: true,
        emitAssertForImportAttributes: true,
        // plugins: [
        //   [
        //     '@swc/plugin-styled-components',
        //     {
        //       'displayName': process.env.NODE_ENV !== 'production',
        //       fileName: false,
        //       'ssr': true,
        //     },
        //   ],
        // ],
      },
    },
    module: {
      // type: /\.c(ts|js)x?$/.test(url) ? "commonjs" : "es6",
      type: nextloaded.format === "module" ? "es6" : "commonjs",
      // lazy: true,
      // ignoreDynamic: true,
      // importInterop: "node",
    },
    //todo
    // sourceMaps: 'inline',
    env: {
      targets: {
        chrome: 105,
        firefox: 105,
        safari: 12,
        edge: 106,
        samsung: 18,
        ios: 12,
      },
    },
    sourceMaps: true,
    inlineSourcesContent: true,
    inputSourceMap: true,
  }).catch((err) => console.log(err));

  const code = payload?.code ?? "";

  console.log(`Processed ${url}`);
  console.log(code);

  return {
    // format: /\.c(ts|js)x?$/.test(url) ? "commonjs" : "module",
    format: "module",
    shortCircuit: true,
    source: code,
  };
}

async function getPackageType(url) {
  // `url` is only a file path during the first iteration when passed the
  // resolved url from the load() hook
  // an actual file path from load() will contain a file extension as it's
  // required by the spec
  // this simple truthy check for whether `url` contains a file extension will
  // work for most projects but does not cover some edge-cases (such as
  // extensionless files or a url ending in a trailing space)
  const isFilePath = !!extname(url);
  // If it is a file path, get the directory it's in
  const dir = isFilePath ? dirname(fileURLToPath(url)) : url;
  // Compose a file path to a package.json in the same directory,
  // which may or may not exist
  const packagePath = resolvePath(dir, "package.json");
  // Try to read the possibly nonexistent package.json
  const packageFile = await readFile(packagePath, { encoding: "utf8" })
    .then((filestring) => JSON.parse(filestring))
    .catch((err) => {
      if (err?.code !== "ENOENT") console.error(err);
    });
  const { type } = packageFile || {};
  // Ff package.json existed and contained a `type` field with a value, voila
  if (type) return type;
  // fallback in the event that there *is* a package.json but it doesn't
  // contain a `type` field
  if (packageFile && !type) return "commonjs";
  // Otherwise, (if not at the root) continue checking the next directory up
  // If at the root, stop and return false
  return dir.length > 1 && getPackageType(resolvePath(dir, ".."));
}

function containsCJS(source) {
  const src = "" + source;

  // A realistic version of this loader would use a parser like Acorn to check for actual `module.exports` syntax
  if (/exports[\[\.( ?=)]/.test(src)) {
    return true;
  }

  if (/require\(/.test(src) && !/createRequire\(/.test(src)) {
    return true;
  }
}
