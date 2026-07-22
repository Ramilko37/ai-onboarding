import assert from "node:assert/strict";
import test from "node:test";
import { formatTodayLabel } from "./formatTodayLabel";

test("formats the current workspace date in Russian", () => {
  assert.equal(
    formatTodayLabel(new Date("2026-07-22T09:00:00")),
    "Среда, 22 июля",
  );
});
