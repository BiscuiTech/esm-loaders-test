import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { transformSync } from '@swc/core';

const typescriptExtension = /\.m?tsx?$/;

/**
 *
 * @param {string} url
 * @returns
 */
export function processJavascriptFile(url) {
  const rawSource = readFileSync(fileURLToPath(url), 'utf-8');

  const { code } = transformSync(rawSource, {
    filename: url,
    jsc: {
      target: 'es2018',
      parser: {
        syntax: typescriptExtension.test(url) ? 'typescript' : 'ecmascript',
        decorators: true,
        dynamicImport: true,
        importAssertions: true,
        ...(typescriptExtension.test(url) ? { tsx: true } : { jsx: true }),
      },
      transform: {
        react: {
          runtime: 'automatic',
        },
        legacyDecorator: typescriptExtension.test(url) ? false : true,
        decoratorMetadata: typescriptExtension.test(url) ? true : false,
      },
      experimental: {
        keepImportAssertions: true,
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
      // type: /\.c(ts|js)x?$/.test(url) ? 'commonjs' : 'es6',
      type: 'es6'
    },
    //todo
    // sourceMaps: 'inline',
    // env: {
    //   targets: {
    //     chrome: 105,
    //     firefox: 105,
    //     safari: 10,
    //     edge: 106,
    //     samsung: 18,
    //     ios: 10,
    //     android: 8,
    //   },
    // },
    sourceMaps: true,
    inlineSourcesContent: true,
    inputSourceMap: true,
  });

  return {
    format: /\.c(ts|js)x?$/.test(url) ? 'commonjs' : 'module',
    shortCircuit: true,
    source: code,
  };
}

