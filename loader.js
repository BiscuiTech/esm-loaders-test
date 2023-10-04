import { processJavascriptFile } from "./javascript.js"

/**
 *
 * @param {string} url
 * @param {*} context
 * @param {*} nextLoad
 * @returns
 */
export async function load(url, context, nextLoad) {
  // if (
  //   url.includes(process.env.V5_SCOPEPATH_ENV) ||
  //   url.includes('@cbcradcan')
  // ) {
    console.log(url);
    if (/\.[mc]?(ts|js)x?$/.test(url)) {
      return processJavascriptFile(url);
    } /* else if (/\.(svg|png|jpg)$/.test(url)) {
      return processImageFile(url);
    } */
  // }

  // // Assume files without extension (e.g. tsc) are 'commonjs'
  // eslint-disable-next-line no-param-reassign
  context.format ||= 'commonjs';

  // Let Node.js handle all other URLs.
  return nextLoad(url, context);
}

