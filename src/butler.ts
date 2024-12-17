import * as child_process from "child_process";
import * as core from "@actions/core";
import * as os from "os";
import * as io from "@actions/io";
import * as cache from "@actions/tool-cache";

import { getVersion } from "./input";

export async function installButler() {
  const version = await getVersion();
  const butler = await getButler(version);

  core.info("Adding butler to PATH.");
  core.addPath(butler);

  const binaryPath = await io.which("butler", true);
  if (binaryPath === "") {
    throw new Error("butler was not found in PATH.");
  }

  core.info(child_process.execSync(`${binaryPath} -V`).toString());
}

async function getButler(version: string): Promise<string> {
  const butlerPath = cache.find("butler", version);

  if (butlerPath !== "") {
    core.info(`Found butler in cache at ${butlerPath}.`);
    return butlerPath;
  }

  const downloadUrl = getDownloadUrl(version);

  core.info(`Downloading butler from ${downloadUrl}...`);
  const downloadPath = await cache.downloadTool(downloadUrl);

  core.info("Extracting butler...");
  const extractPath = await cache.extractZip(downloadPath);

  core.info("Caching butler...");
  const cacheDirectory = await cache.cacheDir(
    extractPath,
    "butler",
    version,
    os.arch(),
  );
  core.info(`Cached butler to ${cacheDirectory}.`);

  return cacheDirectory;
}

function getDownloadUrl(version: string): string {
  const platform = getPlatform();
  const arch = getArch();

  return `https://broth.itch.zone/butler/${platform}-${arch}/${version}/archive/default`;
}

function getArch(): string {
  let arch;

  switch (os.arch()) {
    // The available architectures can be found at:
    // https://nodejs.org/api/process.html#process_process_arch
    case "x64":
      arch = "amd64";
      break;
    case "ia32":
      arch = "i386";
      break;
    default:
      throw new Error(
        `butler is not supported on the ${os.arch()} architecture`,
      );
  }

  core.info(`Architecture has been discovered as '${arch}'.`);

  return arch;
}

function getPlatform(): string {
  let platform;

  switch (os.platform()) {
    case "darwin":
      platform = "darwin";
      break;
    case "linux":
      platform = "linux";
      break;
    case "win32":
      platform = "windows";
      break;
    default:
      throw new Error(
        `butler is not supported on the ${os.platform()} platform`,
      );
  }

  core.info(`Platform has been discovered as '${platform}'.`);

  return platform;
}
