import * as packageJson from '../package.json' assert { type: "json" };


export function fromTS(): string {
  return packageJson.version
}
