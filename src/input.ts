import * as core from "@actions/core";

export async function getVersion(): Promise<string> {
  let version = core.getInput("butler-version");

  if (!version) {
    console.log(`butler-version has not been set. Defaulting to 'latest'.`);
    version = "LATEST";
  } else {
    console.log(`butler-version has been set to '${version}'.`);
  }

  return version;
}
