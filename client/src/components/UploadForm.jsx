import { useState } from 'react'
import { extractTextFromFile, extractTextFromPlain } from '../lib/textExtraction'
import { generateQuizFromText } from '../lib/quizGenerator'

export default function UploadForm({ onReady }) {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let extractedText = ''
      
      if (file) {
        extractedText = await extractTextFromFile(file)
      } else if (text.trim()) {
        extractedText = await extractTextFromPlain(text)
      } else {
        setError('Please select a file or paste some text.')
        setLoading(false)
        return
      }

      if (!extractedText || extractedText.trim().length === 0) {
        setError('Could not extract text from input. Please try a different file or paste text directly.')
        setLoading(false)
        return
      }

      // Generate quiz client-side
      const quiz = generateQuizFromText(extractedText, 10)
      const id = Date.now().toString() // Simple ID generation
      
      // Store in localStorage
      localStorage.setItem(`quiz_${id}`, JSON.stringify(quiz))
      
      onReady({ id, quiz })
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
          <label>Document (PDF or TXT)</label>
          <input type="file" accept=".pdf,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <small style={{ color: 'var(--muted)', fontSize: '12px' }}>PDF and TXT files are supported. For other formats, paste the text directly.</small>
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


