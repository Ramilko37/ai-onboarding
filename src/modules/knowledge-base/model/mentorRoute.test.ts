import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../../../../app/api/mentor-chat/route";

test("mentor chat route returns grounded answer with sources", async () => {
  const response = await POST(
    new Request("http://localhost/api/mentor-chat", {
      method: "POST",
      body: JSON.stringify({
        question: "Где хранить лосось после открытия упаковки?",
        role: "cook",
        employeeName: "Иван"
      })
    })
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.isGrounded, true);
  assert.ok(payload.answer.includes("Источник"));
  assert.ok(payload.sources.some((source: { title: string }) => source.title === "Регламент хранения продуктов"));
});

test("mentor chat route rejects empty question", async () => {
  const response = await POST(
    new Request("http://localhost/api/mentor-chat", {
      method: "POST",
      body: JSON.stringify({
        question: "   ",
        role: "cook"
      })
    })
  );
  const payload = await response.json();

  assert.equal(response.status, 400);
  assert.match(payload.error, /question/i);
});
