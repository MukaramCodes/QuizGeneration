import { useRef, useState } from 'react'
import { extractTextFromFile, extractTextFromPlain } from '../lib/textExtraction'
import { generateQuizFromText } from '../lib/quizGenerator'

const MAX_FILES = 10

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

      extractedText = collectedSections.join('\n\n')

      if (!extractedText || extractedText.trim().length === 0) {
        setError('We could not extract usable text. Try using text-based PDFs or paste the lecture notes directly.')
        setLoading(false)
        return
      }

      const quiz = generateQuizFromText(extractedText, 10)
      if (!quiz.questions || quiz.questions.length === 0) {
        setError('We could not generate any questions. Try adding more detailed content or additional lectures.')
        setLoading(false)
        return
      }
      const id = Date.now().toString() // Simple ID generation
      
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


