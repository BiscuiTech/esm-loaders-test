import packageJson from './package.json';

export function fromESM() {
  return packageJson.version
}
