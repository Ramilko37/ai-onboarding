import assert from "node:assert/strict";
import test from "node:test";
import { getWorkspaceHref, parseWorkspaceSegment } from "./workspaceRoute";

test("maps public workspace paths to existing views", () => {
  assert.equal(parseWorkspaceSegment("today"), "today");
  assert.equal(parseWorkspaceSegment("plan"), "route");
  assert.equal(parseWorkspaceSegment("mentor"), "mentor");
  assert.equal(parseWorkspaceSegment("unknown"), "today");
});

test("builds stable URLs for tabs and task detail", () => {
  assert.equal(getWorkspaceHref("route"), "/onboarding-agent/plan");
  assert.equal(getWorkspaceHref("task", "espresso-setup"), "/onboarding-agent/task/espresso-setup");
});
