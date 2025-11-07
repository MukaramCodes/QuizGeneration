const STOPWORDS = new Set(
  'a,an,the,and,or,if,then,else,when,of,in,on,for,to,from,by,with,as,at,is,are,was,were,be,been,being,that,this,these,those,it,its,into,over,under,after,before,about,via,can,could,should,would,may,might,will,shall,do,does,did,done,doing,not,no,nor,so,such,than,too,very,also,any,each,other,more,most,some,less,least,own,same,per,within,between,across,up,down,out,off,above,below,again,further,once'.split(
    ','
  )
);

const MIN_SENTENCE_LENGTH = 35;

function sanitizeWord(word) {
  return word ? word.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '').toLowerCase() : '';
}

function stripToken(word) {
  return word ? word.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '') : '';
}

function titleCase(value) {
  if (!value) return '';
  return value
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function prettifyOption(value) {
  return titleCase(value.replace(/\s+/g, ' ').trim());
}

function sentenceSplit(text) {
  return text
    .replace(/\r/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .split(/[\.\!\?\n]+/g)
    .map((s) => s.trim())
    .filter((s) => s.length >= MIN_SENTENCE_LENGTH);
}

function tokenize(text) {
  return text
    .replace(/[^A-Za-z0-9\s\-]/g, ' ')
    .split(/\s+/)
    .map((t) => sanitizeWord(t))
    .filter((t) => t && !STOPWORDS.has(t) && t.length > 3);
}

function buildFrequency(tokens) {
  const freq = new Map();
  for (const token of tokens) {
    freq.set(token, (freq.get(token) || 0) + 1);
  }
  return freq;
}

function splitSentenceTokens(sentence) {
  return sentence
    .split(/\s+/)
    .filter(Boolean);
}

function collectPhrases(sentences, freq) {
  const phraseMap = new Map();

  sentences.forEach((sentence, sentenceIndex) => {
    const tokens = splitSentenceTokens(sentence);
    const cleaned = tokens.map((tok) => sanitizeWord(tok));

    for (let i = 0; i < tokens.length; i += 1) {
      const base = cleaned[i];
      if (!base || base.length < 4 || STOPWORDS.has(base)) continue;

      let length = 1;
      let score = freq.get(base) || 1;
      const phraseParts = [stripToken(tokens[i])];
      const normalizedParts = [base];

      while (length < 3 && i + length < tokens.length) {
        const next = cleaned[i + length];
        if (!next || next.length < 4 || STOPWORDS.has(next)) break;
        phraseParts.push(stripToken(tokens[i + length]));
        normalizedParts.push(next);
        score += freq.get(next) || 1;
        length += 1;
      }

      const normalized = normalizedParts.join(' ');
      const phrase = phraseParts.join(' ').trim();
      if (!phrase || phrase.length < 4) continue;

      const existing = phraseMap.get(normalized);
      const candidate = {
        sentenceIndex,
        start: i,
        length,
        phrase,
        normalized,
        score,
      };

      if (!existing || candidate.score > existing.score) {
        phraseMap.set(normalized, candidate);
      }
    }
  });

  return Array.from(phraseMap.values()).sort((a, b) => b.score - a.score);
}

function shuffleArray(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function improveStem(stem) {
  const cleaned = stem.replace(/\s+/g, ' ').trim();
  return cleaned.includes('____') ? `Fill in the blank: ${cleaned}` : cleaned;
}

function buildQuestionFromCandidate(sentence, candidate, allPhrases, keywordList) {
  const tokens = splitSentenceTokens(sentence);
  if (candidate.start >= tokens.length) return null;

  const end = Math.min(candidate.start + candidate.length, tokens.length);
  const blankTokens = [];

  tokens.forEach((token, idx) => {
    if (idx === candidate.start) {
      const trailingMatch = tokens[end - 1].match(/[.,!?;:]+$/);
      const placeholder = trailingMatch ? `____${trailingMatch[0]}` : '____';
      blankTokens.push(placeholder);
    } else if (idx > candidate.start && idx < end) {
      // skip inner tokens of the phrase
    } else {
      blankTokens.push(token);
    }
  });

  const stem = blankTokens.join(' ').replace(/\s+([.,!?;:])/g, '$1');
  const correct = prettifyOption(candidate.phrase);
  if (!correct || correct.length < 2) return null;

  const distractors = [];
  for (const phrase of allPhrases) {
    if (phrase.normalized === candidate.normalized) continue;
    const option = prettifyOption(phrase.phrase);
    if (!option || option.toLowerCase() === correct.toLowerCase()) continue;
    if (distractors.some((d) => d.toLowerCase() === option.toLowerCase())) continue;
    distractors.push(option);
    if (distractors.length >= 3) break;
  }

  if (distractors.length < 3) {
    for (const word of keywordList) {
      const option = titleCase(word);
      if (!option || option.toLowerCase() === correct.toLowerCase()) continue;
      if (distractors.some((d) => d.toLowerCase() === option.toLowerCase())) continue;
      distractors.push(option);
      if (distractors.length >= 3) break;
    }
  }

  if (distractors.length < 3) return null;

  const options = shuffleArray([correct, ...distractors.slice(0, 3)]);
  const answerIndex = options.findIndex((opt) => opt.toLowerCase() === correct.toLowerCase());

  return {
    question: improveStem(stem),
    options,
    answerIndex: answerIndex >= 0 ? answerIndex : 0,
  };
}

function createKeywordFallback(keyword, sentences, allPhrases, keywordList) {
  const lower = keyword.toLowerCase();
  for (let sentenceIndex = 0; sentenceIndex < sentences.length; sentenceIndex += 1) {
    const sentence = sentences[sentenceIndex];
    if (!sentence.toLowerCase().includes(lower)) continue;

    const tokens = splitSentenceTokens(sentence);
    const cleaned = tokens.map((tok) => sanitizeWord(tok));
    const index = cleaned.findIndex((tok) => tok === lower);
    if (index === -1) continue;

    const candidate = {
      sentenceIndex,
      start: index,
      length: 1,
      phrase: stripToken(tokens[index]),
      normalized: lower,
      score: 1,
    };

    const question = buildQuestionFromCandidate(sentence, candidate, allPhrases, keywordList);
    if (question) return question;
  }
  return null;
}

export function generateQuizFromText(text, desiredCount = 10) {
  const sentences = sentenceSplit(text);
  const tokens = tokenize(text);
  const freq = buildFrequency(tokens);
  const keywordList = Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);

  const phrases = collectPhrases(sentences, freq);
  const questions = [];
  const usedSentences = new Set();
  const usedPhrases = new Set();

  for (const candidate of phrases) {
    if (questions.length >= desiredCount) break;
    if (usedSentences.has(candidate.sentenceIndex)) continue;
    const question = buildQuestionFromCandidate(
      sentences[candidate.sentenceIndex],
      candidate,
      phrases,
      keywordList
    );
    if (question) {
      questions.push(question);
      usedSentences.add(candidate.sentenceIndex);
      usedPhrases.add(candidate.normalized);
    }
  }

  if (questions.length < desiredCount) {
    for (const candidate of phrases) {
      if (questions.length >= desiredCount) break;
      if (usedPhrases.has(candidate.normalized)) continue;
      const question = buildQuestionFromCandidate(
        sentences[candidate.sentenceIndex],
        candidate,
        phrases,
        keywordList
      );
      if (question) {
        questions.push(question);
        usedPhrases.add(candidate.normalized);
      }
    }
  }

  if (questions.length < desiredCount) {
    for (const keyword of keywordList) {
      if (questions.length >= desiredCount) break;
      const question = createKeywordFallback(keyword, sentences, phrases, keywordList);
      if (question) {
        questions.push(question);
      }
    }
  }

  return {
    title: 'Auto-generated Quiz',
    questions,
  };
}

export function gradeSubmission(quiz, answersMap) {
  const results = [];
  let score = 0;
  quiz.questions.forEach((q, idx) => {
    const answerValue = answersMap[idx];
    const userIndex = answerValue === undefined ? -1 : Number(answerValue);
    const correct = userIndex === q.answerIndex;
    if (correct) score += 1;
    results.push({
      question: q.question,
      options: q.options,
      correctIndex: q.answerIndex,
      correctAnswer: q.options[q.answerIndex],
      userIndex,
    });
  });
  return {
    total: quiz.questions.length,
    correct: score,
    incorrect: quiz.questions.length - score,
    details: results,
  };
}

