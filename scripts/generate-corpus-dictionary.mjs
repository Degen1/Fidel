import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const projectRoot = process.cwd();
const corpusPath = "/tmp/fidel-tigrinya-corpus.jsonl";
const constantsDir = path.join(projectRoot, "constants");
const tokenPattern = /^[\u1200-\u135A]{2,24}$/u;
const tokenFinder = /[\u1200-\u135A]+/gu;

const existing = new Set();
for (const filename of fs.readdirSync(constantsDir)) {
  if (!filename.startsWith("qanqa-dictionary-") || !filename.endsWith(".json")) continue;
  if (filename.startsWith("qanqa-dictionary-corpus-source-")) continue;
  const records = JSON.parse(fs.readFileSync(path.join(constantsDir, filename), "utf8"));
  for (const record of records) {
    if (record.word) existing.add(record.word.trim());
  }
}

for (const filename of fs.readdirSync(constantsDir)) {
  if (!filename.startsWith("qanqa-dictionary-") || !filename.endsWith(".ts")) continue;
  const source = fs.readFileSync(path.join(constantsDir, filename), "utf8");
  for (const match of source.matchAll(/\bword:\s*"([^"]+)"/g)) existing.add(match[1]);
}

const counts = new Map();
const examples = new Map();
const input = fs.createReadStream(corpusPath, { encoding: "utf8" });
const lines = readline.createInterface({ input, crlfDelay: Infinity });

for await (const line of lines) {
  let record;
  try {
    record = JSON.parse(line);
  } catch {
    continue;
  }

  const text = `${record.title ?? ""}። ${record.content ?? ""}`;
  const sentences = text.split(/(?<=[።!?፧፨])|\n+/u);
  for (const rawSentence of sentences) {
    const sentence = rawSentence.replace(/\s+/g, " ").trim();
    if (sentence.length < 8 || sentence.length > 280) continue;
    if (/[A-Za-z\uFFFD]/u.test(sentence)) continue;

    const uniqueInSentence = new Set(sentence.match(tokenFinder) ?? []);
    for (const word of uniqueInSentence) {
      if (!tokenPattern.test(word) || existing.has(word)) continue;
      counts.set(word, (counts.get(word) ?? 0) + 1);
      if (!examples.has(word)) examples.set(word, sentence);
    }
  }
}

const selected = [...counts.entries()]
  .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
  .map(([word, frequency]) => ({ word, example: examples.get(word), frequency }));

for (const filename of fs.readdirSync(constantsDir)) {
  if (filename.startsWith("qanqa-dictionary-corpus-source-") && filename.endsWith(".json")) {
    fs.unlinkSync(path.join(constantsDir, filename));
  }
}

const chunkSize = 10_000;
const chunkCount = Math.ceil(selected.length / chunkSize);
for (let index = 0; index < chunkCount; index += 1) {
  const chunk = selected.slice(index * chunkSize, (index + 1) * chunkSize);
  const suffix = String(index + 1).padStart(2, "0");
  fs.writeFileSync(
    path.join(constantsDir, `qanqa-dictionary-corpus-source-${suffix}.json`),
    `${JSON.stringify(chunk)}\n`,
  );
}

const imports = Array.from(
  { length: chunkCount },
  (_, index) => {
    const suffix = String(index + 1).padStart(2, "0");
    return `import source${suffix} from "./qanqa-dictionary-corpus-source-${suffix}.json";`;
  },
).join("\n");
const spreads = Array.from(
  { length: chunkCount },
  (_, index) => `  ...source${String(index + 1).padStart(2, "0")},`,
).join("\n");
fs.writeFileSync(
  path.join(constantsDir, "qanqa-dictionary-corpus-words.ts"),
  `import type { DictionaryWord } from "./qanqa-dictionary-words";\n\n${imports}\n\nconst sourceWords = [\n${spreads}\n];\n\nexport const CORPUS_DICTIONARY_WORDS: DictionaryWord[] = sourceWords.map(\n  ({ word, example }, index) => ({\n    id: String(index + 10_001),\n    word,\n    definitions: [],\n    examples: [example],\n    synonyms: [],\n    antonyms: [],\n  }),\n);\n`,
);

console.log(`Generated ${selected.length} Tigrinya corpus entries.`);
