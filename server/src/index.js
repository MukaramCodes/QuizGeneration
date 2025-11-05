const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { nanoid } = require('nanoid');
const { extractTextFromUpload, extractTextFromPlain } = require('./textExtraction');
const { generateQuizFromText, gradeSubmission } = require('./quizGenerator');
const { quizStore } = require('./store');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({ dest: uploadsDir });

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const { body } = req;
    let text = '';

    if (req.file) {
      text = await extractTextFromUpload(req.file);
      // cleanup temp file
      fs.unlink(req.file.path, () => {});
    } else if (body && typeof body.text === 'string' && body.text.trim().length > 0) {
      text = await extractTextFromPlain(body.text);
    } else {
      return res.status(400).json({ error: 'No file or text provided' });
    }

    if (!text || text.trim().length === 0) {
      return res.status(422).json({ error: 'Could not extract text from input' });
    }

    const quiz = generateQuizFromText(text, 10);
    const id = nanoid(10);
    quizStore.set(id, quiz);

    res.json({ id, quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/quiz/:id', (req, res) => {
  const quiz = quizStore.get(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  res.json({ id: req.params.id, quiz });
});

app.post('/api/quiz/:id/submit', (req, res) => {
  const quiz = quizStore.get(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  const { answers } = req.body;
  const result = gradeSubmission(quiz, answers || {});
  res.json(result);
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});


