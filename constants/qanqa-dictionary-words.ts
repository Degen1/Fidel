import { EXTRA_DICTIONARY_WORDS } from "./qanqa-dictionary-extra-words";

export type DictionaryWord = {
  id: string;
  word: string;
  definitions: string[];
  examples: string[];
  synonyms?: string[];
  antonyms?: string[];
};

export const DICTIONARY_WORDS: DictionaryWord[] = [
  {
    id: "1",
    word: "ሰላም",
    definitions: [
      "ጦርነት፣ ባእሲ ወይ ሁከት ዘይብሉ ናይ ህድኣትን ዕርቅን ኩነታት።",
      "ሰባት ክራኸቡ ከለዉ ከም ሰላምታ ዝጥቀሙላ ቃል።",
    ],
    examples: [
      "ሰላም፣ ከመይ ኣለኻ?",
      "ክልቲኦም ወገናት ሰላም ንምፍጣር ተሰማሚዖም።",
    ],
    synonyms: ["ዕርቂ", "ህድኣት"],
    antonyms: ["ጦርነት", "ባእሲ", "ሁከት"],
  },
  {
    id: "2",
    word: "ትምህርቲ",
    definitions: [
      "ፍልጠት፣ ክእለትን ስነ-ምግባርን ናይ ምምሃር ወይ ምስትምሃር መስርሕ።",
      "ኣብ ቤት ትምህርቲ ወይ ካልእ ቦታ ዝወሃብ ትምህርታዊ ፍልጠት።",
    ],
    examples: [
      "ትምህርቲ ንዕብየት ሰብን ሕብረተሰብን ኣገዳሲ እዩ።",
      "እታ ተምሃሪት ኣብ ትምህርታ ኣዝያ ትጽዕር።",
    ],
    synonyms: ["ምምሃር", "ስልጠና", "ፍልጠት"],
    antonyms: ["ድንቁርና"],
  },
   {
    id: "3",
    word: "ከመይ",
    definitions: [
      "ኩነታት፣ ኣገባብ ወይ መንገዲ ሓደ ነገር ንምሕታት እትጥቀመላ ናይ ሕቶ ቃል።",
      "ደሓን ምህላው ሰብ ንምሕታት ኣብ ሰላምታ እትጥቀመላ ቃል።",
    ],
    examples: [
      "ከመይ ኣለኻ?",
      "ነዚ ስራሕ ከመይ ጌርና ንውድኦ?",
    ],
    synonyms: ["ብኸመይ", "ብኸመይ ኣገባብ"],
    antonyms: [],
  },
    {
    id: "4",
    word: "ቀይሕ",
    definitions: [
      "ሕብሪ ደም ወይ ዝበሰለ ኮሚደረ ዝመስል ሕብሪ።",
      "ቀይሕ ሕብሪ ዘለዎ ነገር ዝገልጽ ቅጽል።",
    ],
    examples: [
      "ንሳ ቀይሕ ክዳን ተኸዲና።",
      "እቲ ኮሚደረ ምስ በሰለ ቀይሕ ኮነ።",
    ],
    synonyms: ["ደማዊ"],
    antonyms: [],
  },
    {
    id: "5",
    word: "መኪና",
    definitions: [
      "ብሞተር ዝንቀሳቐስ፣ ሰብ ወይ ኣቕሓ ካብ ቦታ ናብ ቦታ ዘጓዓዕዝ ተሽከርካሪ።",
      "ፍሉይ ስራሕ ንምፍጻም ዝተሰርሐ መካኒካዊ መሳርሒ።",
    ],
    examples: [
      "ኣቦይ ብመኪና ናብ ስራሕ ከይዱ።",
      "እታ መኪና ኣብ ጥቓ ገዛ ደው ኢላ ኣላ።",
    ],
    synonyms: ["ተሽከርካሪ", "ኣውቶሞቢል"],
    antonyms: [],
  },
    {
    id: "6",
    word: "ሰብ",
    definitions: [
      "ሓሳብ፣ ቋንቋን ኣእምሮን ዘለዎ ሰብኣዊ ፍጡር።",
      "ውልቀ ሰብ ወይ ኣባል ሕብረተሰብ።",
    ],
    examples: [
      "ኣብ ኣፍ ደገ ሓደ ሰብ ይጽበ ኣሎ።",
      "ነፍሲ ወከፍ ሰብ ክኽበር ይግባእ።",
    ],
    synonyms: ["ወዲ ሰብ", "ሰብኣዊ ፍጡር", "ውልቀ ሰብ"],
    antonyms: [],
  },
    {
    id: "7",
    word: "ገዛ",
    definitions: [
      "ሰባት ዝነብሩሉን ካብ ኩነታት ኣየር ዝዕቆቡሉን ህንጻ።",
      "ሓደ ስድራ ቤት ዝነብረሉ መንበሪ ቦታ።",
    ],
    examples: [
      "ድሕሪ ትምህርቲ ቀጥታ ናብ ገዛ ኸይደ።",
      "ሓድሽ ገዛ ኣብ ጥቓ ቤት ትምህርቲ ተሰሪሑ።",
    ],
    synonyms: ["ቤት", "መንበሪ", "መንበሪ ቦታ"],
    antonyms: [],
  },
  ...EXTRA_DICTIONARY_WORDS,
];
