const path = require('path');
const textract = require('textract');

function extractWithTextract(filePath) {
  return new Promise((resolve, reject) => {
    textract.fromFileWithPath(filePath, { preserveLineBreaks: true }, (error, text) => {
      if (error) return reject(error);
      resolve(text || '');
    });
  });
}

async function extractTextFromUpload(file) {
  const ext = path.extname(file.originalname || '').toLowerCase();
  // Support PDF, PPT, PPTX, TXT and common docs via textract
  const supported = ['.pdf', '.ppt', '.pptx', '.txt', '.doc', '.docx', '.rtf', '.odt'];
  if (!supported.includes(ext)) {
    // Try anyway; textract can sometimes handle by mime
  }
  const text = await extractWithTextract(file.path);
  return text;
}

async function extractTextFromPlain(input) {
  return String(input || '');
}

module.exports = { extractTextFromUpload, extractTextFromPlain };


