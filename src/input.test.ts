import * as core from "@actions/core";

import { getArchitecture, getVersion } from "./input";

afterEach(() => {
  jest.restoreAllMocks();
});

test("returns version when set", async () => {
  const inputSpy = jest.spyOn(core, "getInput");
  inputSpy.mockImplementation(() => "v1");

  const version = await getVersion();

  expect(version).toEqual("v1");
});

test("returns latest when not set", async () => {
  const version = await getVersion();

  expect(version).toEqual("LATEST");
});

test("returns architecture when set", () => {
  const inputSpy = jest.spyOn(core, "getInput");
  inputSpy.mockImplementation(() => "arm64");

  const architecture = getArchitecture();

  expect(architecture).toEqual("arm64");
});

test("returns an empty string when architecture is not set", () => {
  const architecture = getArchitecture();

  expect(architecture).toEqual("");
});
