import * as core from "@actions/core";

import { getArch, getDownloadUrl, getPlatform } from "./butler";

beforeEach(() => {
  jest.spyOn(core, "info").mockImplementation(() => {});
  jest.spyOn(core, "getInput").mockImplementation(() => "");
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("getArch", () => {
  test("maps x64 to amd64", () => {
    expect(getArch("x64")).toEqual("amd64");
  });

  test("maps arm64 to arm64", () => {
    expect(getArch("arm64")).toEqual("arm64");
  });

  test("maps ia32 to i386", () => {
    expect(getArch("ia32")).toEqual("i386");
  });

  test("throws for an unsupported architecture", () => {
    expect(() => getArch("ppc64")).toThrow(
      "butler is not supported on the ppc64 architecture",
    );
  });

  test("prefers the architecture input over the detected architecture", () => {
    jest.spyOn(core, "getInput").mockImplementation(() => "amd64");

    expect(getArch("arm64")).toEqual("amd64");
  });

  test("throws when the architecture input is not supported", () => {
    jest.spyOn(core, "getInput").mockImplementation(() => "x64");

    expect(() => getArch("x64")).toThrow(
      "butler is not available for the x64 architecture. Supported architectures are: amd64, arm64",
    );
  });
});

describe("getPlatform", () => {
  test("maps darwin to darwin", () => {
    expect(getPlatform("darwin")).toEqual("darwin");
  });

  test("maps linux to linux", () => {
    expect(getPlatform("linux")).toEqual("linux");
  });

  test("maps win32 to windows", () => {
    expect(getPlatform("win32")).toEqual("windows");
  });

  test("throws for an unsupported platform", () => {
    expect(() => getPlatform("freebsd")).toThrow(
      "butler is not supported on the freebsd platform",
    );
  });
});

describe("getDownloadUrl", () => {
  test("builds the URL for a version and target", () => {
    expect(getDownloadUrl("15.30.0", "linux", "arm64")).toEqual(
      "https://broth.itch.zone/butler/linux-arm64/15.30.0/archive/default",
    );
  });

  test("builds the URL for the latest version", () => {
    expect(getDownloadUrl("LATEST", "darwin", "arm64")).toEqual(
      "https://broth.itch.zone/butler/darwin-arm64/LATEST/archive/default",
    );
  });
});
