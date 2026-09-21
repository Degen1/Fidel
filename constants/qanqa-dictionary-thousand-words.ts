import type { DictionaryWord } from "./qanqa-dictionary-words";
import sourceWords from "./qanqa-dictionary-thousand-source.json";

export const THOUSAND_DICTIONARY_WORDS: DictionaryWord[] = sourceWords.map(
  ({ word, definition, synonyms, antonyms }, index) => ({
    id: String(index + 258),
    word,
    definitions: [definition],
    examples: [`“${word}” ዝብል ቃል “${definition}” ዝብል ትርጉም ኣለዎ።`],
    synonyms,
    antonyms,
  }),
);
