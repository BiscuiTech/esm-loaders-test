import { extname } from "node:path";

const EXT = ".json";

export function resolve(specifier, context, next) {
  const { debug, parentURL } = context;
  const { href, pathname } = new URL(specifier, parentURL);
  if (extname(pathname) != EXT) return next(specifier, context);
  if (debug) console.log(`[${NAME}] resolve: ${specifier}`);

  return next(href, context);
}

export async function load(url, context, nextLoad) {
  const { pathname } = new URL(url);
  if (extname(pathname) != EXT) return nextLoad(url, context);
  const source = JSON.stringify(await import(url));
  const result = `export default ${String(source)}`;
  return { source: result, shortCircuit: true, format: "module" };
}
