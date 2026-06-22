import assert from "node:assert/strict";
import { answerOnboardingQuestion } from "../lib/answerOnboardingQuestion";
import { knowledgeArticles } from "./mvpDemoData";

const firstDayReply = answerOnboardingQuestion({
  question: "Что мне сделать в первый день?",
  roleId: "support_specialist",
  articles: knowledgeArticles
});

assert.equal(firstDayReply.shouldEscalate, false);
assert.equal(firstDayReply.confidence, "high");
assert.ok(firstDayReply.sources.length > 0);
assert.ok(firstDayReply.sources.some((source) => source.id === "first-day-map"));

const crmReply = answerOnboardingQuestion({
  question: "Как получить доступ к CRM?",
  roleId: "sales_manager",
  articles: knowledgeArticles
});

assert.equal(crmReply.shouldEscalate, false);
assert.equal(crmReply.confidence, "high");
assert.ok(crmReply.sources.some((source) => source.id === "crm-access"));

const sensitiveReply = answerOnboardingQuestion({
  question: "Какая у меня зарплата и бонус?",
  roleId: "developer",
  articles: knowledgeArticles
});

assert.equal(sensitiveReply.shouldEscalate, true);
assert.equal(sensitiveReply.confidence, "low");
assert.equal(sensitiveReply.sources.length, 0);
assert.match(sensitiveReply.escalationReason ?? "", /Чувствительный/);

const unknownReply = answerOnboardingQuestion({
  question: "Где заказать корпоративный велосипед?",
  roleId: "developer",
  articles: knowledgeArticles
});

assert.equal(unknownReply.shouldEscalate, true);
assert.equal(unknownReply.confidence, "low");
assert.equal(unknownReply.sources.length, 0);

console.log("MVP assistant smoke tests passed");
