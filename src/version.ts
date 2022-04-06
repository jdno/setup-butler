import * as core from "@actions/core";

export async function getVersion(): Promise<string> {
  return core.getInput("butler-version") || "latest";
}
