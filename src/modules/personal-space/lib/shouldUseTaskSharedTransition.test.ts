import assert from "node:assert/strict";
import { shouldUseTaskSharedTransition } from "./shouldUseTaskSharedTransition";

assert.equal(shouldUseTaskSharedTransition(false, false), false);
assert.equal(shouldUseTaskSharedTransition(true, true), false);
assert.equal(shouldUseTaskSharedTransition(true, false), true);

console.log("task shared transition: 3 assertions passed");
