import { useEffect, useState } from 'react'

export default function Quiz({ quiz, onSubmit, onBack }) {
  const [answers, setAnswers] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    setAnswers({})
    setError('')
  }, [quiz])

  if (!quiz) {
    return (
      <div className="card">
        <p>No quiz loaded.</p>
        <button onClick={onBack}>Go back</button>
      </div>
    )
  }

  const handleChange = (qIdx, optIdx) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
    if (error) setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const unanswered = quiz.questions.filter((_, idx) => answers[idx] === undefined)
    if (unanswered.length > 0) {
      setError('Please attempt every question before submitting.')
      return
    }
    setError('')
    onSubmit(answers)
  }

  return (
    <section>
      <h2>{quiz.title}</h2>
      <form onSubmit={handleSubmit} className="card">
        {quiz.questions.map((q, qi) => (
          <div key={qi} className="question">
            <div className="stem">
              <span className="qnum">Q{qi + 1}.</span> {q.question}
            </div>
            <div className="options">
              {q.options.map((opt, oi) => (
                <label key={oi} className={`option ${answers[qi] === oi ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name={`q-${qi}`}
                    checked={answers[qi] === oi}
                    onChange={() => handleChange(qi, oi)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        {error && <div className="error" style={{ marginTop: '8px' }}>{error}</div>}
        <div className="actions">
          <button type="button" onClick={onBack} className="secondary">Back</button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </section>
  )
}


