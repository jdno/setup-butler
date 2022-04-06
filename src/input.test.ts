import * as core from "@actions/core";

import { getVersion } from "./input";

afterEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
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
