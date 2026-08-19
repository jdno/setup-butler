import * as core from "@actions/core";

export async function getVersion(): Promise<string> {
  let version = core.getInput("version");

  if (!version) {
    core.info("version has not been set. Defaulting to 'latest'.");
    version = "LATEST";
  } else {
    core.info(`version has been set to '${version}'.`);
  }

  // butler's release channels name the latest version in uppercase
  if (version.toLowerCase() === "latest") {
    version = "LATEST";
  }

  return version;
}

export function getArchitecture(): string {
  const architecture = core.getInput("architecture");

  if (architecture) {
    core.info(`architecture has been set to '${architecture}'.`);
  }

  return architecture;
}
