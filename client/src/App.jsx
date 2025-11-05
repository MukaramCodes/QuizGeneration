import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import UploadForm from './components/UploadForm'
import Quiz from './components/Quiz'
import Results from './components/Results'
import { api } from './lib/api'

function AppShell() {
  const [quiz, setQuiz] = useState(null)
  const [quizId, setQuizId] = useState(null)
  const [results, setResults] = useState(null)
  const navigate = useNavigate()

  const startQuiz = (payload) => {
    setQuiz(payload.quiz)
    setQuizId(payload.id)
    setResults(null)
    navigate('/quiz')
  }

  const submitQuiz = async (answers) => {
    const res = await fetch(api(`/api/quiz/${quizId}/submit`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    })
    const data = await res.json()
    setResults(data)
    navigate('/results')
  }

  const reset = () => {
    setQuiz(null)
    setQuizId(null)
    setResults(null)
    navigate('/')
  }

  return (
    <div className="container">
      <header>
        <h1>Quizgen</h1>
      </header>
      <Routes>
        <Route path="/" element={<UploadForm onReady={startQuiz} />} />
        <Route path="/quiz" element={<Quiz quiz={quiz} onSubmit={submitQuiz} onBack={reset} />} />
        <Route path="/results" element={<Results quiz={quiz} results={results} onRestart={reset} />} />
      </Routes>
      <footer>
        <small>Auto-generated quizzes from your lecture materials</small>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}


