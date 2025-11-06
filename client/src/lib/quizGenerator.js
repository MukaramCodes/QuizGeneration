const STOPWORDS = new Set(
  'a,an,the,and,or,if,then,else,when,of,in,on,for,to,from,by,with,as,at,is,are,was,were,be,been,being,that,this,these,those,it,its,into,over,under,after,before,about,via,can,could,should,would,may,might,will,shall,do,does,did,done,doing,not,no,nor,so,such,than,too,very,also,any,each,other,more,most,some,less,least,own,same,per,within,between,across,up,down,out,off,above,below,again,further,once'.split(
    ','
  )
);

function tokenize(text) {
  return text
    .replace(/[^A-Za-z0-9\s\-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t && !STOPWORDS.has(t) && t.length > 2);
}

function unique(array) {
  return Array.from(new Set(array));
}

function pickRandom(arr, n) {
  const copy = [...arr];
  const res = [];
  while (copy.length && res.length < n) {
    const idx = Math.floor(Math.random() * copy.length);
    res.push(copy.splice(idx, 1)[0]);
  }
  return res;
}

function sentenceSplit(text) {
  const raw = text
    .replace(/\r/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .split(/[\.\!\?\n]+/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 25);
  return raw;
}

function scoreKeywords(tokens) {
  const freq = new Map();
  for (const t of tokens) freq.set(t, (freq.get(t) || 0) + 1);
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t);
}

function buildDistractors(allKeywords, correct, count) {
  const pool = allKeywords.filter((k) => k !== correct).slice(0, 100);
  const picks = pickRandom(unique(pool), count);
  // Fallback to variations if not enough
  while (picks.length < count) {
    picks.push(correct + Math.random().toString(36).slice(2, 5));
  }
  return picks;
}

function makeQuestionFromSentence(sentence, allKeywords) {
  const words = sentence.split(/\s+/);
  // choose a candidate word from the sentence that is in keywords
  const candidates = words
    .map((w, i) => ({ w: w.replace(/[^A-Za-z0-9\-]/g, ''), i }))
    .filter((x) => x.w.length > 2 && allKeywords.includes(x.w.toLowerCase()))
    .slice(0, 5);
  if (candidates.length === 0) return null;
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  const answer = chosen.w;
  const stem = words
    .map((w, i) => (i === chosen.i ? '____' : w))
    .join(' ');
  const distractors = buildDistractors(allKeywords, answer.toLowerCase(), 3);
  const options = unique([answer, ...distractors]).slice(0, 4);
  // shuffle
  const shuffled = pickRandom(options, options.length);
  const correctIndex = shuffled.findIndex((o) => o.toLowerCase() === answer.toLowerCase());
  return {
    question: stem.trim(),
    options: shuffled,
    answerIndex: correctIndex >= 0 ? correctIndex : 0
  };
}

export function generateQuizFromText(text, desiredCount = 10) {
  const sentences = sentenceSplit(text);
  const tokens = tokenize(text);
  const keywords = scoreKeywords(tokens).slice(0, 200);
  const questions = [];
  for (const s of sentences) {
    if (questions.length >= desiredCount) break;
    const q = makeQuestionFromSentence(s, keywords);
    if (q) questions.push(q);
  }
  // If not enough, fabricate simple definition style
  while (questions.length < desiredCount && keywords.length) {
    const term = keywords[questions.length % keywords.length];
    const stem = `Which of the following best matches the term: ${term}?`;
    const distractors = buildDistractors(keywords, term, 3);
    const options = pickRandom(unique([term, ...distractors]), 4);
    const answerIndex = options.findIndex((o) => o === term);
    questions.push({ question: stem, options, answerIndex: answerIndex >= 0 ? answerIndex : 0 });
  }
  return {
    title: 'Auto-generated Quiz',
    questions
  };
}

export function gradeSubmission(quiz, answersMap) {
  const results = [];
  let score = 0;
  quiz.questions.forEach((q, idx) => {
    const userIndex = Number(answersMap[idx] ?? -1);
    const correct = userIndex === q.answerIndex;
    if (correct) score += 1;
    results.push({
      question: q.question,
      options: q.options,
      correctIndex: q.answerIndex,
      userIndex
    });
  });
  return {
    total: quiz.questions.length,
    correct: score,
    incorrect: quiz.questions.length - score,
    details: results
  };
}

