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
        "В базе стандартов нет надёжного источника для этого ответа. Создайте вопрос наставнику или уточните у управляющего, чтобы не выдумывать правило точки."
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
    ? `${params.employeeName}, по базе стандартов Valle Sanchez:`
    : "По базе стандартов Valle Sanchez:";
  const sourceLines = pickVisibleSources(sources, 2)
    .map((source) => `Источник: ${formatSourceName(source.source)} — ${source.excerpt}`)
    .join("\n");
  const routeLine = params.activeTaskTitles?.length
    ? `\n\nВ вашем маршруте рядом с этим: ${params.activeTaskTitles.slice(0, 2).join("; ")}.`
    : "";

  return {
    isGrounded: true,
    needsManagerReview: false,
    sources,
    answer: `${lead}\n${sourceLines}${routeLine}\n\nИспользуются примерные стандарты сети для показа. Если ситуация отличается от регламента точки, остановитесь и уточните у старшего смены.`
  };
}

function createExcerpt(content: string) {
  const sentence = content.split(/(?<=[.!?])\s+/)[0] ?? content;
  return sentence.length > 220 ? `${sentence.slice(0, 217)}...` : sentence;
}

function pickVisibleSources(sources: MentorSource[], limit: number) {
  const seenDocumentIds = new Set<string>();
  const visibleSources: MentorSource[] = [];

  for (const source of sources) {
    if (seenDocumentIds.has(source.documentId)) {
      continue;
    }

    seenDocumentIds.add(source.documentId);
    visibleSources.push(source);

    if (visibleSources.length === limit) {
      return visibleSources;
    }
  }

  return sources.slice(0, limit);
}

function formatSourceName(source: string) {
  return source.replace(/^Demo KB\s*·\s*/i, "пример стандарта сети · ");
}
