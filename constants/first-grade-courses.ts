export type CourseLesson = {
  title: string;
  icon: string;
  summary: string;
  explanation: string;
  examples: string[];
  question: string;
  answer: string;
};

export type FirstGradeCourse = {
  title: string;
  subtitle: string;
  accent: string;
  softAccent: string;
  lessons: CourseLesson[];
};

export const FIRST_GRADE_COURSES = {
  math: {
    title: "ቁጽሪ",
    subtitle: "ቁጽሪ፣ ምድማር፣ ምጉዳልን ቅርጽታትን",
    accent: "#2563EB",
    softAccent: "#DBEAFE",
    lessons: [
      { title: "ቁጽሪ 1–20", icon: "🔢", summary: "ምቝጻርን ቁጽሪ ምልላይን", explanation: "ቁጽሪ ብቕደም ሰዓብ ንቘጽር። ነፍሲ ወከፍ ቁጽሪ ክንደይ ነገራት ከም ዘለዉ ይነግረና።", examples: ["1 2 3 4 5", "11 12 13 14 15", "16 17 18 19 20"], question: "ድሕሪ 14 ዝመጽእ ቁጽሪ እንታይ እዩ?", answer: "15" },
      { title: "ምንጽጻር", icon: "⚖️", summary: "ዓቢ፣ ንእሽቶን ማዕረን", explanation: "ክልተ ጉጅለታት ብምቝጻር ኣየናይ ከም ዝበዝሕ፣ ዝውሕድ ወይ ማዕረ ምዃኑ ንፈልጥ።", examples: ["8 > 5 — ሸሞንተ ካብ ሓሙሽተ ይዓቢ", "3 < 7 — ሰለስተ ካብ ሸውዓተ ይንእስ", "4 = 4 — ማዕረ"], question: "9 ካብ 6 ይዓቢ ድዩ?", answer: "እወ፣ 9 > 6።" },
      { title: "ምድማር", icon: "➕", summary: "ጉጅለታት ብሓደ ምግባር", explanation: "ምድማር ማለት ክልተ ወይ ልዕሊኡ ዝዀኑ ጉጅለታት ብሓደ ምግባር እዩ።", examples: ["2 + 3 = 5", "4 + 4 = 8", "7 + 2 = 9"], question: "6 + 3 ክንደይ እዩ?", answer: "9" },
      { title: "ምጉዳል", icon: "➖", summary: "ካብ ጉጅለ ምውሳድ", explanation: "ምጉዳል ማለት ካብ ዘሎና ገለ ምውሳድ እዩ። እቲ ዝተረፈ መልሲ ይኸውን።", examples: ["5 − 2 = 3", "9 − 4 = 5", "10 − 1 = 9"], question: "8 − 3 ክንደይ እዩ?", answer: "5" },
      { title: "ቅርጽታት", icon: "🔺", summary: "ክብ፣ ካሬን ስሉስ ኩርናዕን", explanation: "ቅርጽታት ብቝጽሪ ጎድኖምን ኩርናዖምን ንፈልዮም። ክብ ጎድኒ የብሉን፤ ካሬ ኣርባዕተ ማዕረ ጎድኒ ኣለዎ።", examples: ["○ ክብ", "□ ካሬ", "△ ስሉስ ኩርናዕ", "▭ ኣርባዕተ ኩርናዕ"], question: "ሰለስተ ጎድኒ ዘለዎ ቅርጺ እንታይ ይበሃል?", answer: "ስሉስ ኩርናዕ።" },
      { title: "መለክዒ", icon: "📏", summary: "ንውሓት፣ ክብደትን ግዜን", explanation: "ንውሓት ብመስመር፣ ክብደት ብሚዛን፣ ግዜ ድማ ብሰዓት ንዕቅን።", examples: ["ነዊሕ / ሓጺር", "ከቢድ / ፈኲስ", "ንግሆ / ቀትሪ / ምሸት"], question: "ክብደት ንምዕቃን እንታይ ንጥቀም?", answer: "ሚዛን።" },
    ],
  },
  tigrinya: {
    title: "ትግርኛ",
    subtitle: "ምንባብ፣ ምጽሓፍን ምርዳእን",
    accent: "#C2410C",
    softAccent: "#FFEDD5",
    lessons: [
      { title: "ፊደላትን ድምጽን", icon: "ፊ", summary: "ፊደል ብግቡእ ምንባብ", explanation: "ነፍሲ ወከፍ ፊደል ቅርጽን ድምጽን ኣለዎ። ፊደላት ብድምጺ እናደገምና ንለማመድ።", examples: ["ሀ ሁ ሂ ሃ ሄ ህ ሆ", "ለ ሉ ሊ ላ ሌ ል ሎ", "መ ሙ ሚ ማ ሜ ም ሞ"], question: "እቲ ራብዓይ ፊደል ካብ ሀ ሁ ሂ ሃ እንታይ እዩ?", answer: "ሃ" },
      { title: "ቃላት", icon: "🧩", summary: "ፊደላት ኣጣሚርካ ቃል ምስራሕ", explanation: "ክልተ ወይ ልዕሊኡ ፊደላት ብምጥማር ቃል ንሰርሕ። ቃል ትርጉም ዘለዎ ድምጺ ወይ ጽሑፍ እዩ።", examples: ["ቤ + ት = ቤት", "ማ + ይ = ማይ", "ዓ + ይ + ኒ = ዓይኒ"], question: "‘መ’ን ‘ጽሓፍ’ን እንተጣሚርና እንታይ ይኸውን?", answer: "መጽሓፍ።" },
      { title: "ሓረግ", icon: "💬", summary: "ምሉእ ሓሳብ ምግላጽ", explanation: "ሓረግ ምሉእ ሓሳብ ይገልጽ። ብዓቢ ፊደል ኣይጅምርን እኳ ድኣ፣ ኣብ መወዳእታ ግን ምልክት ፍጻመ ንገብር።", examples: ["ሳራ መጽሓፍ ተንብብ።", "ተስፋይ ኩዕሶ ይጻወት።", "ንሕና ናብ ቤት ትምህርቲ ንኸይድ።"], question: "‘ዓሊ ማይ ይሰቲ’ ምሉእ ሓረግ ድዩ?", answer: "እወ። ኣብ መወዳእታ ‘።’ ንውስኽ።" },
      { title: "ስምን ግስን", icon: "🏃", summary: "ሰብ፣ ቦታ፣ ነገርን ተግባርን", explanation: "ስም ንሰብ፣ ቦታ ወይ ነገር ይገልጽ። ግሲ ድማ ተግባር ይገልጽ።", examples: ["ስም፦ ሓኪም፣ ቤት፣ ኩዕሶ", "ግሲ፦ ይስዕ፣ ይጐዪ፣ ይድቅስ"], question: "ኣብ ‘ሄለን ትጐዪ’ እቲ ግሲ ኣየናይ እዩ?", answer: "ትጐዪ።" },
      { title: "ንባብን ምርዳእን", icon: "📖", summary: "ሓጺር ጽሑፍ ኣንቢብካ ምምላስ", explanation: "ጽሑፍ ብቐስታ ነንብብ፣ ቀንዲ ሓሳቡ ንፈልጥ፣ ድሕሪኡ ሕቶ ንምልስ።", examples: ["ሚኪኤል ንግሆ ተንሲኡ ገጹ ተሓጽበ። ቁርሲ በሊዑ ናብ ቤት ትምህርቲ ኸደ።"], question: "ሚኪኤል ቅድሚ ናብ ቤት ትምህርቲ ምኻዱ እንታይ ገበረ?", answer: "ገጹ ተሓጽበን ቁርሲ በልዐን።" },
      { title: "ምጽሓፍ", icon: "✏️", summary: "ጽሩይ ፊደልን ሓጺር ሓረግን", explanation: "ክንጽሕፍ ከለና ፊደላት ማዕረ ንገብሮም፣ ኣብ መንጎ ቃላት ቦታ ንገድፍ፣ ሓረግ ብፍጻመ ንዛዝም።", examples: ["ስመይ ______ ይበሃል።", "ኣነ ______ እፈቱ።", "ሎሚ ኩነታት ኣየር ______ እዩ።"], question: "ብዛዕባ እትፈትዎ ጸወታ ሓደ ሓረግ ጽሓፍ።", answer: "ኣብነት፦ ኣነ ኩዕሶ እግሪ ምጽዋት እፈቱ።" },
    ],
  },
  english: {
    title: "እንግሊዝኛ",
    subtitle: "መሰረታዊ እንግሊዝኛ ብመምርሒ ትግርኛ",
    accent: "#7C3AED",
    softAccent: "#EDE9FE",
    lessons: [
      { title: "ፊደላት A–Z", icon: "ABC", summary: "ዓበይትን ንኣሽቱን ፊደላት", explanation: "እንግሊዝኛ 26 ፊደላት ኣለዉዎ። ነፍሲ ወከፍ ፊደል ዓቢን ንእሽቶን ቅርጺ ኣለዎ።", examples: ["A a • B b • C c", "D d • E e • F f", "X x • Y y • Z z"], question: "ንእሽቶ ቅርጺ ናይ G እንታይ እዩ?", answer: "g" },
      { title: "ድምጺ ፊደላት", icon: "🔊", summary: "ፊደልን ድምጹን", explanation: "ፊደላት ኣብ ቃል ድምጺ ይህቡ። ድምጺ ፊደል ምፍላጥ ሓድሽ ቃል ንምንባብ ይሕግዝ።", examples: ["A — apple", "B — ball", "C — cat", "D — dog"], question: "‘sun’ ብኣየናይ ፊደል ይጅምር?", answer: "S" },
      { title: "ሰላምታ", icon: "👋", summary: "ሰላም ምባልን ስም ምሕታትን", explanation: "ንሓደ ሰብ ክንረኽቦ ከለና Hello ንብል። ስሙ ንምሕታት What is your name? ንብል።", examples: ["Hello! — ሰላም!", "My name is Sara. — ስመይ ሳራ ይበሃል።", "How are you? — ከመይ ኣለኻ/ኺ?"], question: "‘ስመይ ዳንኤል ይበሃል’ ብእንግሊዝኛ ከመይ ንብል?", answer: "My name is Daniel." },
      { title: "ሕብርታትን ቁጽርታትን", icon: "🎨", summary: "Colors and numbers", explanation: "ሕብርታትን ቁጽርታትን ኣብ መዓልታዊ ዘረባ ብዙሕ ንጥቀመሎም።", examples: ["red — ቀይሕ", "blue — ሰማያዊ", "one, two, three — ሓደ፣ ክልተ፣ ሰለስተ", "ten — ዓሰርተ"], question: "‘ቀጠልያ’ ብእንግሊዝኛ እንታይ እዩ?", answer: "green" },
      { title: "ስድራ ቤት", icon: "👨‍👩‍👧", summary: "Family words", explanation: "ኣባላት ስድራ ቤትና ብቐሊል ቃላት እንግሊዝኛ ንገልጾም።", examples: ["mother — ኣደ", "father — ኣቦ", "sister — ሓፍቲ", "brother — ሓው", "family — ስድራ ቤት"], question: "‘ሓፍቲ’ ብእንግሊዝኛ እንታይ እዩ?", answer: "sister" },
      { title: "ቀሊል ሓረጋት", icon: "💬", summary: "I am, I have, I like", explanation: "ቀሊል ሓረግ ብሰብ፣ ግሲን ነገርን ይስራሕ። ተደጋጋሚ ልምምድ ንዘረባ የቐልሎ።", examples: ["I am a student. — ኣነ ተማሃራይ እየ።", "I have a book. — መጽሓፍ ኣለኒ።", "I like milk. — ጸባ እፈቱ።"], question: "‘ኣነ ኩዕሶ እፈቱ’ ብእንግሊዝኛ ጽሓፍ።", answer: "I like football." },
    ],
  },
  science: {
    title: "ስነ ፍልጠት",
    subtitle: "ሰብነት፣ ህያዋን፣ ተፈጥሮን ምርምርን",
    accent: "#059669",
    softAccent: "#D1FAE5",
    lessons: [
      { title: "ኣካላት ሰብነት", icon: "🧍", summary: "ኣካላትናን ስርሖምን", explanation: "ኣካላት ሰብነትና ዝተፈላለየ ስራሕ ይሰርሑ። ዓይኒ ይርኢ፣ እዝኒ ይሰምዕ፣ እግሪ ድማ ንምኻድ ይሕግዘና።", examples: ["ዓይኒ — ምርኣይ", "እዝኒ — ምስማዕ", "ኣፍንጫ — ምሽታት", "ኢድ — ምሓዝ"], question: "ብኣፍንጫና እንታይ ንገብር?", answer: "ንሽትትን ንትንፍስን።" },
      { title: "ህያውን ዘይህያውን", icon: "🌱", summary: "ዝዓቢ፣ ዝምገብን ዘይዓብን", explanation: "ህያው ነገር ይዓቢ፣ ይምገብ፣ ማይ የድልዮን ይፋረን። ዘይህያው ነገር ባዕሉ ኣይዓብን።", examples: ["ሰብ፣ ተኽሊ፣ ከልቢ — ህያዋን", "እምኒ፣ ወንበር፣ ኩዕሶ — ዘይህያዋን"], question: "ተኽሊ ህያው ድዩ? ስለምንታይ?", answer: "እወ። ይዓቢ፣ ማይን ብርሃንን የድልዮ።" },
      { title: "ክፍልታት ተኽሊ", icon: "🌻", summary: "ሱር፣ ጉንዲ፣ ቆጽልን ዕምባባን", explanation: "ሱር ማይ ይስሕብ፣ ጉንዲ ነቲ ተኽሊ ይድግፍ፣ ቆጽሊ መግቢ ይሰርሕ፣ ዕምባባ ድማ ዘርኢ ንምፍጣር ይሕግዝ።", examples: ["ሱር — ኣብ ሓመድ", "ጉንዲ — ድጋፍ", "ቆጽሊ — ብርሃን ይቕበል", "ዕምባባ — ዘርኢ"], question: "ማይ ካብ ሓመድ ዝስሕብ ክፍሊ ተኽሊ እንታይ እዩ?", answer: "ሱር።" },
      { title: "እንስሳታትን መንበሪኦምን", icon: "🐾", summary: "እንስሳታት ኣበይ ይነብሩ?", explanation: "እንስሳታት ንምግቢ፣ ማይን ዕቝባን ዝሰማማዕ መንበሪ ኣለዎም።", examples: ["ዓሳ — ኣብ ማይ", "ገመል — ኣብ በረኻ", "ዑፍ — ኣብ ሰፈር", "ኣንበሳ — ኣብ መሮር"], question: "ዓሳ ንምንታይ ኣብ ማይ ይነብር?", answer: "ብጉልፋፉ ኣብ ማይ ስለ ዝትንፍስ።" },
      { title: "ማይን ኣየርን", icon: "💧", summary: "ንህይወት ኣገደስቲ ጸጋታት", explanation: "ሰብ፣ እንስሳን ተኽልን ማይን ኣየርን የድልዮም። ጽሩይ ማይ ንሰቲ፣ ኣየር ድማ ንትንፍስ።", examples: ["ማይ ንሰቲ።", "ኣየር ንትንፍስ።", "ማይ ብዘይምብኻን ንዕቅብ።"], question: "ማይ ንምዕቃብ ሓደ እንገብሮ ነገር ግለጽ።", answer: "ኣብነት፦ ስንና ክንሓጽብ ከለና ቡምባ ንዓጹ።" },
      { title: "ኩነታት ኣየር", icon: "☀️", summary: "ጸሓይ፣ ደበና፣ ዝናብን ንፋስን", explanation: "ኩነታት ኣየር ካብ መዓልቲ ናብ መዓልቲ ይቕየር። ብምዕዛብ ክንደይ ሙቐት፣ ደበና፣ ንፋስ ወይ ዝናብ ከም ዘሎ ንገልጽ።", examples: ["☀️ ጸሓያዊ", "☁️ ደበናማ", "🌧️ ዝናባዊ", "💨 ንፋሳዊ"], question: "ዝናብ ክዘንብ ከሎ እንታይ ንኽደን?", answer: "ካቦርታ ዝናብ ንኽደን ወይ ጽላል ንሕዝ።" },
    ],
  },
} satisfies Record<string, FirstGradeCourse>;

export type FirstGradeCourseKey = keyof typeof FIRST_GRADE_COURSES;
