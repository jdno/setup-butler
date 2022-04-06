import * as core from "@actions/core";

import { installButler } from "./butler";

async function main() {
  try {
    await installButler();
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed(error as string);
    }
  }
}

main();
