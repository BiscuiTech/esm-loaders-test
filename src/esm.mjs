import packageJson from "../package.json" assert { type: "json" };

export function fromESM() {
  return packageJson.version;
}
