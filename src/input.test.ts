import * as core from "@actions/core";

import { getArchitecture, getVersion } from "./input";

afterEach(() => {
  jest.restoreAllMocks();
});

test("returns version when set", async () => {
  const inputSpy = jest.spyOn(core, "getInput");
  inputSpy.mockImplementation(() => "15.30.0");

  const version = await getVersion();

  expect(version).toEqual("15.30.0");
});

test("reads the version input", async () => {
  const inputSpy = jest.spyOn(core, "getInput");
  inputSpy.mockImplementation(() => "15.30.0");

  await getVersion();

  expect(inputSpy).toHaveBeenCalledWith("version");
});

test("returns latest when not set", async () => {
  const version = await getVersion();

  expect(version).toEqual("LATEST");
});

test("normalizes latest to the name of the release channel", async () => {
  const inputSpy = jest.spyOn(core, "getInput");
  inputSpy.mockImplementation(() => "latest");

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
