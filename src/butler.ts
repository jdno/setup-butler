import * as child_process from "child_process";
import * as core from "@actions/core";
import * as os from "os";
import * as io from "@actions/io";
import * as cache from "@actions/tool-cache";

import { getArchitecture, getVersion } from "./input";

// The architectures that can be requested with the `architecture` input. They
// are named after butler's release channels.
const SUPPORTED_ARCHITECTURES = ["amd64", "arm64"];

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
  const platform = getPlatform();
  const arch = getArch();

  const butlerPath = cache.find("butler", version, arch);

  if (butlerPath !== "") {
    core.info(`Found butler in cache at ${butlerPath}.`);
    return butlerPath;
  }

  const downloadUrl = getDownloadUrl(version, platform, arch);

  core.info(`Downloading butler from ${downloadUrl}...`);
  let downloadPath: string;
  try {
    downloadPath = await cache.downloadTool(downloadUrl);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to download butler ${version} for ${platform}-${arch} from ${downloadUrl}: ${reason}`,
    );
  }

  core.info("Extracting butler...");
  const extractPath = await cache.extractZip(downloadPath);

  core.info("Caching butler...");
  const cacheDirectory = await cache.cacheDir(
    extractPath,
    "butler",
    version,
    arch,
  );
  core.info(`Cached butler to ${cacheDirectory}.`);

  return cacheDirectory;
}

export function getDownloadUrl(
  version: string,
  platform: string,
  arch: string,
): string {
  return `https://broth.itch.zone/butler/${platform}-${arch}/${version}/archive/default`;
}

export function getArch(nodeArch: string = os.arch()): string {
  const architecture = getArchitecture();

  if (architecture !== "") {
    if (!SUPPORTED_ARCHITECTURES.includes(architecture)) {
      throw new Error(
        `butler is not available for the ${architecture} architecture. Supported architectures are: ${SUPPORTED_ARCHITECTURES.join(", ")}`,
      );
    }

    return architecture;
  }

  let arch;

  switch (nodeArch) {
    // The available architectures can be found at:
    // https://nodejs.org/api/process.html#process_process_arch
    case "x64":
      arch = "amd64";
      break;
    case "arm64":
      arch = "arm64";
      break;
    case "ia32":
      arch = "i386";
      break;
    default:
      throw new Error(
        `butler is not supported on the ${nodeArch} architecture`,
      );
  }

  core.info(`Architecture has been discovered as '${arch}'.`);

  return arch;
}

export function getPlatform(nodePlatform: string = os.platform()): string {
  let platform;

  switch (nodePlatform) {
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
        `butler is not supported on the ${nodePlatform} platform`,
      );
  }

  core.info(`Platform has been discovered as '${platform}'.`);

  return platform;
}
