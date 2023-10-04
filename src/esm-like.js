import packageJson from "../package.json" assert { type: "json" };

export function fromESMLike() {
  return packageJson.version;
}
