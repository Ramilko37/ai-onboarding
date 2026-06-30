import assert from "node:assert/strict";
import test from "node:test";
import { answerMentorQuestion } from "../lib/answerMentorQuestion";
import { retrieveKnowledge } from "../lib/retrieveKnowledge";
import { knowledgeDocuments } from "./knowledgeDocuments";

test("knowledge documents are demo-marked and source-backed", () => {
  assert.ok(knowledgeDocuments.length >= 8);
  assert.ok(
    knowledgeDocuments.every((document) => document.isDemoContent),
    "demo knowledge must be explicitly marked as demo content"
  );
  assert.ok(
    knowledgeDocuments.every((document) => document.source && document.sections.length > 0),
    "every document must expose a source and sections"
  );
});

test("retrieveKnowledge finds role-specific storage guidance with citations", () => {
  const result = retrieveKnowledge({
    question: "Где хранить лосось после открытия упаковки?",
    role: "cook",
    limit: 3
  });

  assert.ok(result.matches.length > 0);
  assert.equal(result.matches[0].document.title, "Регламент хранения продуктов");
  assert.equal(result.matches[0].document.roles.includes("cook"), true);
  assert.match(result.matches[0].chunk.content, /холодильник|температур/i);
});

test("retrieveKnowledge keeps administrator answers inside administrator sources", () => {
  const result = retrieveKnowledge({
    question: "Что делать администратору при возврате оплаты гостю?",
    role: "admin",
    limit: 3
  });

  assert.ok(result.matches.length > 0);
  assert.equal(result.matches[0].document.roles.includes("admin"), true);
  assert.match(result.matches[0].document.title, /возврат|кассов/i);
});

test("retrieveKnowledge uses mock vector matches for barista espresso standards", () => {
  const result = retrieveKnowledge({
    question: "Как настроить эспрессо если пролив слишком быстрый и водянистый?",
    role: "barista",
    topicIds: ["barista-espresso-setup"],
    limit: 3
  });

  assert.ok(result.matches.length > 0);
  assert.equal(result.matches[0].document.roles.includes("barista"), true);
  assert.match(result.matches[0].document.title, /эспрессо/i);
  assert.equal(result.matches[0].vectorScore > 0, true);
});

test("retrieveKnowledge finds milk texture and equipment cleaning sources for barista", () => {
  const milk = retrieveKnowledge({
    question: "Какая текстура молока нужна для капучино?",
    role: "barista",
    limit: 2
  });
  const cleaning = retrieveKnowledge({
    question: "Когда промывать группу и питчер после напитков?",
    role: "barista",
    limit: 2
  });

  assert.ok(milk.matches.some((match) => /молок|капучино/i.test(match.document.title)));
  assert.ok(cleaning.matches.some((match) => /чист|оборудован/i.test(match.document.title)));
});

test("answerMentorQuestion returns grounded answer and citations", () => {
  const response = answerMentorQuestion({
    question: "Где хранить лосось после открытия упаковки?",
    role: "cook"
  });

  assert.equal(response.isGrounded, true);
  assert.equal(response.needsManagerReview, false);
  assert.ok(response.answer.includes("Источник"));
  assert.ok(response.sources.some((source) => source.title === "Регламент хранения продуктов"));
});

test("answerMentorQuestion returns grounded barista answer with demo-source disclaimer", () => {
  const response = answerMentorQuestion({
    question: "Что делать если эспрессо течёт слишком быстро?",
    role: "barista",
    topicIds: ["barista-espresso-setup"],
    employeeName: "София"
  });

  assert.equal(response.isGrounded, true);
  assert.equal(response.needsManagerReview, false);
  assert.match(response.answer, /Demo KB|демо/i);
  assert.ok(response.sources.some((source) => /эспрессо/i.test(source.title)));
});

test("answerMentorQuestion falls back for HR or disciplinary questions", () => {
  const response = answerMentorQuestion({
    question: "Меня могут уволить, если я плохо отвечу на диагностику?",
    role: "admin"
  });

  assert.equal(response.isGrounded, false);
  assert.equal(response.needsManagerReview, true);
  assert.deepEqual(response.sources, []);
  assert.match(response.answer, /управляющ|наставник|HR/i);
});

test("answerMentorQuestion falls back for unknown questions even with route topics", () => {
  const response = answerMentorQuestion({
    question: "Какой пароль от гостевого вайфая?",
    role: "cook",
    topicIds: ["cook-hygiene", "cook-storage", "cook-defects"]
  });

  assert.equal(response.isGrounded, false);
  assert.equal(response.needsManagerReview, true);
  assert.deepEqual(response.sources, []);
  assert.match(response.answer, /нет надёжного источника|уточнить/i);
});
