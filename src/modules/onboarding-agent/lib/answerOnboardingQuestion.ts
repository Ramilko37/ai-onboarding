import type { DemoRoleId, KnowledgeArticle } from "../model/mvpDemoData";

export type AssistantReply = {
  text: string;
  confidence: "high" | "low";
  sources: KnowledgeArticle[];
  shouldEscalate: boolean;
  escalationReason?: string;
};

const sensitiveKeywords = [
  "зарплата",
  "оклад",
  "бонус",
  "уволь",
  "дисциплинар",
  "жалоба",
  "конфликт",
  "домог",
  "персональные данные",
  "паспорт",
  "больнич",
  "болею",
  "medical",
  "salary",
  "legal",
  "dismissal",
  "harassment"
];

const fallbackReply =
  "Я не уверен, что могу ответить по разрешённой базе знаний. Передам вопрос HR/наставнику и зафиксирую эскалацию, чтобы человек вернулся с подтверждённым ответом.";

function normalize(value: string) {
  return value.toLowerCase().replace(/ё/g, "е").trim();
}

function tokenize(value: string) {
  return normalize(value)
    .split(/[^a-zа-я0-9]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length > 2);
}

function articleMatchesRole(article: KnowledgeArticle, roleId: DemoRoleId) {
  return article.roleIds === "all" || article.roleIds.includes(roleId);
}

function getArticleScore(article: KnowledgeArticle, query: string, tokens: string[], roleId: DemoRoleId) {
  if (!articleMatchesRole(article, roleId)) {
    return -1;
  }

  const searchable = normalize(
    [article.title, article.source, article.body, article.answer, article.tags.join(" ")].join(" ")
  );

  const tokenScore = tokens.reduce((score, token) => {
    if (article.tags.some((tag) => normalize(tag).includes(token) || token.includes(normalize(tag)))) {
      return score + 4;
    }

    if (searchable.includes(token)) {
      return score + 1;
    }

    return score;
  }, 0);

  const exactTagScore = article.tags.some((tag) => normalize(query).includes(normalize(tag))) ? 5 : 0;
  const roleScore = article.roleIds === "all" ? 1 : 2;

  return tokenScore + exactTagScore + roleScore;
}

export function answerOnboardingQuestion(params: {
  question: string;
  roleId: DemoRoleId;
  articles: KnowledgeArticle[];
}): AssistantReply {
  const query = normalize(params.question);
  const tokens = tokenize(params.question);

  if (!query || tokens.length === 0) {
    return {
      text: "Задайте вопрос по адаптации: доступы, первый день, маршрут, CRM, наставник, review или эскалация.",
      confidence: "low",
      sources: [],
      shouldEscalate: false
    };
  }

  if (sensitiveKeywords.some((keyword) => query.includes(normalize(keyword)))) {
    return {
      text: fallbackReply,
      confidence: "low",
      sources: [],
      shouldEscalate: true,
      escalationReason: "Чувствительный вопрос вне демо-контура AI-ассистента"
    };
  }

  const rankedArticles = params.articles
    .map((article) => ({
      article,
      score: getArticleScore(article, query, tokens, params.roleId)
    }))
    .filter((item) => item.score >= 4)
    .sort((left, right) => right.score - left.score)
    .slice(0, 2)
    .map((item) => item.article);

  if (rankedArticles.length === 0) {
    return {
      text: fallbackReply,
      confidence: "low",
      sources: [],
      shouldEscalate: true,
      escalationReason: "Ответ не найден в curated базе знаний"
    };
  }

  const [mainArticle, extraArticle] = rankedArticles;
  const sourceNote = extraArticle
    ? ` Дополнительно проверьте связанный источник: «${extraArticle.title}».`
    : "";

  return {
    text: `${mainArticle.answer}${sourceNote}`,
    confidence: "high",
    sources: rankedArticles,
    shouldEscalate: false
  };
}
