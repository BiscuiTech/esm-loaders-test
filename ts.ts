import * as packageJson from './package.json';


export function fromTS() : string {
  return packageJson.version
}
