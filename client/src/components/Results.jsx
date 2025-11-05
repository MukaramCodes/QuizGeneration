export default function Results({ quiz, results, onRestart }) {
  if (!quiz || !results) {
    return (
      <div className="card">
        <p>No results to show.</p>
        <button onClick={onRestart}>Start over</button>
      </div>
    )
  }

  const percent = Math.round((results.correct / results.total) * 100)

  return (
    <section>
      <h2>Your Results</h2>
      <div className="card">
        <div className="score">
          <strong>Score:</strong> {results.correct} / {results.total} ({percent}%)
        </div>
        <ol className="result-list">
          {results.details.map((r, idx) => (
            <li key={idx} className="result-item">
              <div className="stem">{r.question}</div>
              <ul className="options">
                {r.options.map((opt, oi) => {
                  const isCorrect = oi === r.correctIndex
                  const isChosen = oi === r.userIndex
                  return (
                    <li key={oi} className={`opt ${isCorrect ? 'correct' : ''} ${isChosen && !isCorrect ? 'chosen' : ''}`}>
                      {opt}
                      {isCorrect ? ' ✓' : ''}
                      {isChosen && !isCorrect ? ' ✗' : ''}
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ol>
        <div className="actions">
          <button onClick={onRestart}>Create another quiz</button>
        </div>
      </div>
    </section>
  )
}


