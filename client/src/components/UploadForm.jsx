import { useState } from 'react'
import { api } from '../lib/api'

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
      if (file) {
        const form = new FormData()
        form.append('file', file)
        const res = await fetch(api('/api/upload'), { method: 'POST', body: form })
        if (!res.ok) throw new Error('Upload failed')
        const data = await res.json()
        onReady(data)
      } else if (text.trim()) {
        const res = await fetch(api('/api/upload'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        })
        if (!res.ok) throw new Error('Submit failed')
        const data = await res.json()
        onReady(data)
      } else {
        setError('Please select a file or paste some text.')
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
          <label>Presentation or document (PDF/PPT/TXT)</label>
          <input type="file" accept=".pdf,.ppt,.pptx,.txt,.doc,.docx,.rtf,.odt" onChange={(e) => setFile(e.target.files?.[0] || null)} />
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


