import { useRef, useState } from 'react'
import { extractTextFromFile, extractTextFromPlain } from '../lib/textExtraction'
import { generateQuizFromText } from '../lib/quizGenerator'
import { api } from '../lib/api'

const MAX_FILES = 10
const QUESTION_COUNT = 10

function normalizeExtractedText(raw = '') {
  return raw
    .replace(/[\u2022\u2023\u25E6\u2043\u2219\u25CF\u25CB\u25A0\u25AA\u25AB\u2736\u2020\u2021\u00B7\uF0B7\uF0D8\uF0E0\uF0A7\uF076\uF0FC\uFF65\u30FB\u2219\u2666\u2665\uF0B1\uF0B2\u25C6\u25C7\u25B6\u25B7\u25BA\u25CF\u25CB\u25C6\u25D8\uF0A8]+/g, ' ')
    .replace(/[•◦▪◆■□►▶]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/[\u0000-\u001F]/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim()
}

export default function UploadForm({ onReady }) {
  const [files, setFiles] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileChange = (event) => {
    const incoming = Array.from(event.target.files || [])
    if (incoming.length > MAX_FILES) {
      setError(`You can upload up to ${MAX_FILES} files at a time.`)
    } else {
      setError('')
    }
    setFiles(incoming.slice(0, MAX_FILES))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!files.length && !text.trim()) {
        setError('Please upload at least one file or paste some text to generate a quiz.')
        setLoading(false)
        return
      }

      let extractedText = ''
      const collectedSections = []

      if (files.length) {
        if (files.length > MAX_FILES) {
          setError(`Please select ${MAX_FILES} files or fewer.`)
          setLoading(false)
          return
        }

        for (const file of files) {
          try {
            const fileText = await extractTextFromFile(file)
            if (fileText && fileText.trim().length > 0) {
              collectedSections.push(`Source: ${file.name}\n${fileText.trim()}`)
            }
          } catch (err) {
            console.error('File extraction failed:', err)
            setError(`Could not read ${file.name}. Please verify it is a text-based PDF or TXT file.`)
            setLoading(false)
            return
          }
        }
      }

      if (text.trim()) {
        const plainText = await extractTextFromPlain(text)
        if (plainText.trim().length > 0) {
          collectedSections.push(`Pasted Notes\n${plainText.trim()}`)
        }
      }

      extractedText = normalizeExtractedText(collectedSections.join('\n\n'))

      if (!extractedText || extractedText.trim().length === 0) {
        setError('We could not extract usable text. Try using text-based PDFs or paste the lecture notes directly.')
        setLoading(false)
        return
      }

      let quiz = null
      let aiError = null

      try {
        const response = await fetch(api('/api/generate'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: extractedText, count: QUESTION_COUNT })
        })

        if (response.ok) {
          const payload = await response.json()
          if (payload?.quiz?.questions?.length) {
            quiz = {
              title: payload.quiz.title || 'AI-generated Quiz',
              questions: payload.quiz.questions
            }
          } else {
            aiError = 'The AI response did not contain valid questions.'
          }
        } else {
          const data = await response.json().catch(() => ({}))
          aiError = data?.error || 'AI request failed.'
        }
      } catch (err) {
        aiError = err.message || 'AI request failed.'
      }

      if (!quiz) {
        console.warn('Falling back to heuristic generator because AI failed:', aiError)
        quiz = generateQuizFromText(extractedText, QUESTION_COUNT)
      }

      if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        setError(
          aiError
            ? `AI generation failed (${aiError}). Try adding more detailed content or additional lectures.`
            : 'We could not generate any questions. Try adding more detailed content or additional lectures.'
        )
        setLoading(false)
        return
      }
      const id = Date.now().toString()
      
      // Store in localStorage
      localStorage.setItem(`quiz_${id}`, JSON.stringify(quiz))
      
      onReady({ id, quiz })
      setFiles([])
      setText('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>Upload material or paste text</h2>
      <form onSubmit={handleSubmit} className="card">
        <div className="field">
          <label>Lecture documents (PDF or TXT)</label>
          <input ref={fileInputRef} type="file" accept=".pdf,.txt" multiple onChange={handleFileChange} />
          <small style={{ color: 'var(--muted)', fontSize: '12px' }}>Upload up to {MAX_FILES} PDF/TXT files. For other formats, paste the text below.</small>
          {files.length > 0 && (
            <ul className="file-list">
              {files.map((f) => (
                <li key={f.name}>{f.name}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="field">
          <label>Or paste text</label>
          <textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste lecture notes here..." />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Generating…' : 'Generate Quiz'}</button>
      </form>
      <p className="hint">Only one of file or text is needed. We never store your files.</p>
    </section>
  )
}


