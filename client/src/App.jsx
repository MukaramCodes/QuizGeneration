import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import UploadForm from './components/UploadForm'
import Quiz from './components/Quiz'
import Results from './components/Results'
import { gradeSubmission } from './lib/quizGenerator'

function AppShell() {
  const [quiz, setQuiz] = useState(null)
  const [quizId, setQuizId] = useState(null)
  const [results, setResults] = useState(null)
  const navigate = useNavigate()

  // Load quiz/results from storage to support refresh or page revisit
  useEffect(() => {
    const storedQuizId = sessionStorage.getItem('currentQuizId')
    if (!storedQuizId) return

    const storedQuiz = localStorage.getItem(`quiz_${storedQuizId}`)
    if (storedQuiz) {
      setQuiz(JSON.parse(storedQuiz))
      setQuizId(storedQuizId)
      const storedResults = localStorage.getItem(`results_${storedQuizId}`)
      if (storedResults) {
        setResults(JSON.parse(storedResults))
      }
    }
  }, [])

  const startQuiz = (payload) => {
    setQuiz(payload.quiz)
    setQuizId(payload.id)
    setResults(null)
    sessionStorage.setItem('currentQuizId', payload.id)
    localStorage.removeItem(`results_${payload.id}`)
    navigate('/quiz')
  }

  const submitQuiz = (answers) => {
    if (!quiz) return
    
    // Grade locally
    const result = gradeSubmission(quiz, answers)
    
    // Store results in localStorage
    localStorage.setItem(`results_${quizId}`, JSON.stringify(result))
    
    setResults(result)
    navigate('/results')
  }

  const reset = () => {
    if (quizId) {
      localStorage.removeItem(`results_${quizId}`)
    }
    setQuiz(null)
    setQuizId(null)
    setResults(null)
    sessionStorage.removeItem('currentQuizId')
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

export default function App() { return <AppShell /> }


