import { retrieveKnowledge } from "./retrieveKnowledge";
import type { MentorAnswer, MentorQuestionParams, MentorSource } from "../model/types";

const sensitivePattern =
  /увол|штраф|зарплат|больнич|медицин|договор|дисциплин|персональн|паспорт|налог|отпуск|график/i;

export function answerMentorQuestion(params: MentorQuestionParams): MentorAnswer {
  if (sensitivePattern.test(params.question)) {
    return {
      isGrounded: false,
      needsManagerReview: true,
      sources: [],
      answer:
        "Это уже не учебный вопрос по стандартам смены. Я не буду принимать HR, медицинские, юридические или дисциплинарные решения. Лучше спокойно обсудить это с управляющим, наставником или HR-ответственным точки."
    };
  }

  const retrieval = retrieveKnowledge({
    question: params.question,
    role: params.role,
    topicIds: params.topicIds,
    limit: 3
  });

  if (retrieval.matches.length === 0) {
    return {
      isGrounded: false,
      needsManagerReview: true,
      sources: [],
      answer:
        "В демо-базе знаний нет надёжного источника для этого ответа. Чтобы не выдумывать правило точки, лучше уточнить у наставника или управляющего."
    };
  }

  const sources = retrieval.matches.map<MentorSource>((match) => ({
    documentId: match.document.id,
    title: match.document.title,
    source: match.document.source,
    sectionTitle: match.chunk.title,
    excerpt: createExcerpt(match.chunk.content)
  }));

  const lead = params.employeeName
    ? `${params.employeeName}, по базе знаний Маяка:`
    : "По базе знаний Маяка:";
  const sourceLines = sources
    .slice(0, 2)
    .map((source) => `Источник: ${source.title} — ${source.excerpt}`)
    .join("\n");
  const routeLine = params.activeTaskTitles?.length
    ? `\n\nВ вашем маршруте рядом с этим: ${params.activeTaskTitles.slice(0, 2).join("; ")}.`
    : "";

  return {
    isGrounded: true,
    needsManagerReview: false,
    sources,
    answer: `${lead}\n${sourceLines}${routeLine}\n\nЕсли ситуация отличается от демо-регламента точки, остановитесь и уточните у старшего смены.`
  };
}

function createExcerpt(content: string) {
  const sentence = content.split(/(?<=[.!?])\s+/)[0] ?? content;
  return sentence.length > 220 ? `${sentence.slice(0, 217)}...` : sentence;
}
