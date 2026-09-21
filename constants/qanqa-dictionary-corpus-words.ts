import type { DictionaryWord } from "./qanqa-dictionary-words";

import source01 from "./qanqa-dictionary-corpus-source-01.json";
import source02 from "./qanqa-dictionary-corpus-source-02.json";
import source03 from "./qanqa-dictionary-corpus-source-03.json";
import source04 from "./qanqa-dictionary-corpus-source-04.json";
import source05 from "./qanqa-dictionary-corpus-source-05.json";
import source06 from "./qanqa-dictionary-corpus-source-06.json";
import source07 from "./qanqa-dictionary-corpus-source-07.json";
import source08 from "./qanqa-dictionary-corpus-source-08.json";
import source09 from "./qanqa-dictionary-corpus-source-09.json";
import source10 from "./qanqa-dictionary-corpus-source-10.json";
import source11 from "./qanqa-dictionary-corpus-source-11.json";
import source12 from "./qanqa-dictionary-corpus-source-12.json";
import source13 from "./qanqa-dictionary-corpus-source-13.json";
import source14 from "./qanqa-dictionary-corpus-source-14.json";
import source15 from "./qanqa-dictionary-corpus-source-15.json";
import source16 from "./qanqa-dictionary-corpus-source-16.json";
import source17 from "./qanqa-dictionary-corpus-source-17.json";
import source18 from "./qanqa-dictionary-corpus-source-18.json";
import source19 from "./qanqa-dictionary-corpus-source-19.json";
import source20 from "./qanqa-dictionary-corpus-source-20.json";
import source21 from "./qanqa-dictionary-corpus-source-21.json";
import source22 from "./qanqa-dictionary-corpus-source-22.json";
import source23 from "./qanqa-dictionary-corpus-source-23.json";
import source24 from "./qanqa-dictionary-corpus-source-24.json";
import source25 from "./qanqa-dictionary-corpus-source-25.json";
import source26 from "./qanqa-dictionary-corpus-source-26.json";
import source27 from "./qanqa-dictionary-corpus-source-27.json";
import source28 from "./qanqa-dictionary-corpus-source-28.json";
import source29 from "./qanqa-dictionary-corpus-source-29.json";
import source30 from "./qanqa-dictionary-corpus-source-30.json";
import source31 from "./qanqa-dictionary-corpus-source-31.json";
import source32 from "./qanqa-dictionary-corpus-source-32.json";
import source33 from "./qanqa-dictionary-corpus-source-33.json";
import source34 from "./qanqa-dictionary-corpus-source-34.json";
import source35 from "./qanqa-dictionary-corpus-source-35.json";
import source36 from "./qanqa-dictionary-corpus-source-36.json";
import source37 from "./qanqa-dictionary-corpus-source-37.json";

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
  ...source10,
  ...source11,
  ...source12,
  ...source13,
  ...source14,
  ...source15,
  ...source16,
  ...source17,
  ...source18,
  ...source19,
  ...source20,
  ...source21,
  ...source22,
  ...source23,
  ...source24,
  ...source25,
  ...source26,
  ...source27,
  ...source28,
  ...source29,
  ...source30,
  ...source31,
  ...source32,
  ...source33,
  ...source34,
  ...source35,
  ...source36,
  ...source37,
];

export const CORPUS_DICTIONARY_WORDS: DictionaryWord[] = sourceWords.map(
  ({ word, example }, index) => ({
    id: String(index + 10_001),
    word,
    definitions: [],
    examples: [example],
    synonyms: [],
    antonyms: [],
  }),
);
