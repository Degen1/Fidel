import type { DictionaryWord } from "./qanqa-dictionary-words";

import source01 from "./qanqa-dictionary-10k-source-01.json";
import source02 from "./qanqa-dictionary-10k-source-02.json";
import source03 from "./qanqa-dictionary-10k-source-03.json";
import source04 from "./qanqa-dictionary-10k-source-04.json";
import source05 from "./qanqa-dictionary-10k-source-05.json";
import source06 from "./qanqa-dictionary-10k-source-06.json";
import source07 from "./qanqa-dictionary-10k-source-07.json";
import source08 from "./qanqa-dictionary-10k-source-08.json";
import source09 from "./qanqa-dictionary-10k-source-09.json";

const sourceWords = [
  ...source01,
  ...source02,
  ...source03,
  ...source04,
  ...source05,
  ...source06,
  ...source07,
  ...source08,
  ...source09,
];

export const TEN_THOUSAND_DICTIONARY_WORDS: DictionaryWord[] = sourceWords.map(
  ({ word, definition, synonyms, antonyms }, index) => ({
    id: String(index + 1258),
    word,
    definitions: [definition],
    examples: [`“${word}” ዝብል ቃል “${definition}” ዝብል ትርጉም ኣለዎ።`],
    synonyms,
    antonyms,
  }),
);
