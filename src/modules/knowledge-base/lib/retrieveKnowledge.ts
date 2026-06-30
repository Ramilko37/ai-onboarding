import { knowledgeDocuments } from "../model/knowledgeDocuments";
import type {
  KnowledgeChunk,
  KnowledgeDocument,
  KnowledgeMatch,
  RetrieveKnowledgeParams,
  RetrieveKnowledgeResult
} from "../model/types";

const stopWords = new Set([
  "что",
  "как",
  "где",
  "когда",
  "если",
  "после",
  "при",
  "для",
  "или",
  "это",
  "мне",
  "надо",
  "нужно",
  "делать",
  "делать",
  "сотрудник",
  "администратор",
  "повар",
  "бариста"
]);

const synonymTerms: Record<string, string[]> = {
  лосось: ["рыба", "охлаждённые", "холодильник", "хранение"],
  рыба: ["лосось", "охлаждённые", "холодильник", "хранение"],
  возврат: ["оплата", "отмена", "гость", "заказ"],
  возврате: ["оплата", "отмена", "гость", "заказ"],
  задержка: ["претензия", "статус", "гость", "заказ"],
  претензия: ["задержка", "гость", "статус"],
  маркировка: ["этикетка", "дата", "срок"],
  хранить: ["хранение", "холодильник", "температурный"],
  эспрессо: ["помол", "доза", "трамбовка", "экстракция", "пролив"],
  пролив: ["эспрессо", "помол", "экстракция", "водянистый"],
  водянистый: ["быстрый", "пролив", "эспрессо", "помол"],
  быстрый: ["пролив", "эспрессо", "помол"],
  помол: ["доза", "трамбовка", "эспрессо"],
  молоко: ["капучино", "латте", "микропена", "питчер", "текстура"],
  капучино: ["молоко", "микропена", "текстура"],
  латте: ["молоко", "микропена", "рецептура"],
  питчер: ["молоко", "промывать", "питчеры", "питчера", "текстура"],
  группа: ["кофемашина", "группы", "чистка", "чистки", "промывка"],
  группу: ["кофемашина", "группы", "чистка", "чистки", "промывка"],
  промывать: ["очищает", "промывает", "промывается", "чистка", "чистки", "питчер", "группа", "оборудование"],
  чистка: ["чистки", "оборудование", "группа", "питчер", "паровая"]
};

export function retrieveKnowledge(params: RetrieveKnowledgeParams): RetrieveKnowledgeResult {
  const queryTerms = expandTerms(tokenize(params.question));
  const topicIds = new Set(params.topicIds ?? []);
  const matches = knowledgeDocuments
    .flatMap((document) =>
      createChunks(document).map((chunk) => {
        const lexicalScore = scoreChunk({ chunk, document, queryTerms, topicIds });
        const vectorScore = scoreVectorMatch({ chunk, document, queryTerms });
        const score = lexicalScore > 0 ? lexicalScore + vectorScore : 0;

        return {
          chunk,
          document,
          score,
          vectorScore,
          matchedTerms: getMatchedTerms(chunk, document, queryTerms)
        };
      })
    )
    .filter((match) => match.document.roles.includes(params.role))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || a.document.title.localeCompare(b.document.title))
    .slice(0, params.limit ?? 4);

  return { queryTerms, matches };
}

function createChunks(document: KnowledgeDocument[]): KnowledgeChunk[];
function createChunks(document: KnowledgeDocument): KnowledgeChunk[];
function createChunks(document: KnowledgeDocument | KnowledgeDocument[]) {
  if (Array.isArray(document)) {
    return document.flatMap(createChunks);
  }

  return document.sections.map((section) => ({
    id: `${document.id}:${section.id}`,
    documentId: document.id,
    sectionId: section.id,
    title: section.title,
    source: document.source,
    roles: document.roles,
    topicIds: document.topicIds,
    required: document.required,
    content: section.content
  }));
}

function scoreChunk(params: {
  chunk: KnowledgeChunk;
  document: KnowledgeDocument;
  queryTerms: string[];
  topicIds: Set<string>;
}) {
  const searchable = normalize(
    [
      params.document.title,
      params.document.source,
      params.document.topicIds.join(" "),
      params.chunk.title,
      params.chunk.content
    ].join(" ")
  );

  let score = 0;

  for (const term of params.queryTerms) {
    if (searchable.includes(term)) {
      score += term.length > 5 ? 3 : 2;
    }
  }

  if (score === 0) {
    return 0;
  }

  if (params.document.required) {
    score += 1;
  }

  for (const topicId of params.topicIds) {
    if (params.document.topicIds.includes(topicId)) {
      score += 2;
    }
  }

  return score;
}

function getMatchedTerms(
  chunk: KnowledgeChunk,
  document: KnowledgeDocument,
  queryTerms: string[]
) {
  const searchable = normalize(`${document.title} ${chunk.title} ${chunk.content}`);
  return [...new Set(queryTerms.filter((term) => searchable.includes(term)))];
}

function expandTerms(terms: string[]) {
  return [
    ...new Set(
      terms.flatMap((term) => [term, ...(synonymTerms[term] ?? [])]).filter((term) => term.length > 2)
    )
  ];
}

function tokenize(text: string) {
  return normalize(text)
    .split(" ")
    .map((term) => term.trim())
    .filter((term) => term.length > 2 && !stopWords.has(term));
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreVectorMatch(params: {
  chunk: KnowledgeChunk;
  document: KnowledgeDocument;
  queryTerms: string[];
}) {
  if (params.queryTerms.length === 0) {
    return 0;
  }

  const queryVector = createVector(params.queryTerms.join(" "));
  const chunkVector = createVector(
    [
      params.document.title,
      params.document.source,
      params.document.topicIds.join(" "),
      params.chunk.title,
      params.chunk.content
    ].join(" ")
  );
  const similarity = cosineSimilarity(queryVector, chunkVector);

  return Math.round(similarity * 10);
}

function createVector(text: string) {
  const vector = new Array<number>(32).fill(0);
  const terms = tokenize(text);

  for (const term of terms) {
    vector[hashTerm(term) % vector.length] += 1;
  }

  return vector;
}

function hashTerm(term: string) {
  let hash = 0;

  for (let index = 0; index < term.length; index += 1) {
    hash = (hash * 31 + term.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function cosineSimilarity(first: number[], second: number[]) {
  let dot = 0;
  let firstLength = 0;
  let secondLength = 0;

  for (let index = 0; index < first.length; index += 1) {
    dot += first[index] * second[index];
    firstLength += first[index] * first[index];
    secondLength += second[index] * second[index];
  }

  if (firstLength === 0 || secondLength === 0) {
    return 0;
  }

  return dot / (Math.sqrt(firstLength) * Math.sqrt(secondLength));
}
