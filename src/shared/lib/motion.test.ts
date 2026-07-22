import assert from "node:assert/strict";
import { getMotionDuration, motion } from "./motion";

assert.equal(motion.page, 320);
assert.equal(motion.emphasis, 440);
assert.equal(getMotionDuration("control", false), 240);
assert.equal(getMotionDuration("control", true), 120);

console.log("motion tokens: 4 assertions passed");
