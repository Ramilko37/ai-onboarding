import assert from "node:assert/strict";
import { shouldFocusTaskDetail } from "./shouldFocusTaskDetail";

assert.equal(shouldFocusTaskDetail(false), false);
assert.equal(shouldFocusTaskDetail(true), true);

console.log("task detail focus: 2 assertions passed");
