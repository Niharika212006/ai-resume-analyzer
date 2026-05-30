import { useMemo, useState } from 'react'
import Header from "./components/Header";
import ResumeInput from "./components/ResumeInput";
import AnalysisResults from "./components/AnalysisResults";
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
const KEYWORDS = [
  'machine learning',
  'artificial intelligence',
  'data analysis',
  'python',
  'react',
  'resume',
  'leadership',
  'communication',
  'problem solving',
  'project management',
  'optimization',
  'automation',
  'cloud',
  'ai',
]

function getKeywordMatches(text) {
  const normalized = text.toLowerCase()
  return KEYWORDS.filter((keyword) => normalized.includes(keyword))
}

function App() {
  const [resumeText, setResumeText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [message, setMessage] = useState('Paste your resume text or upload a .txt file to get AI-powered insights.')

const handleAnalyze = async () => {
  if (!resumeText.trim()) {
    setMessage('Please paste your resume content first.')
    setAnalysis(null)
    return
  }

  try {
    setMessage('Analyzing resume...')

    const response = await fetch('https://ai-resume-analyzer-fvm4.onrender.com/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeText: resumeText,
      }),
    })

    const data = await response.json()

    setAnalysis(data)

    setMessage(
      'Resume analysis complete. Review the score and suggestions below.'
    )
  } catch (error) {
    console.error(error)
    setMessage('Failed to connect to backend.')
    setAnalysis(null)
  }
}

const handleFile = async (event) => {
  const file = event.target.files?.[0]
  console.log(file.type)
  if (!file) return

  if (file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer()

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise

    let text = ''

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)

      const content = await page.getTextContent()

      text += content.items.map(item => item.str).join(' ')
      text += '\n'
    }
    console.log("Extracted text:")
    console.log(text)
    console.log("Length:", text.length)
    setResumeText(text)

    setMessage('PDF resume loaded successfully.')

    setAnalysis(null)

    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    setResumeText(reader.result ?? '')
    setMessage('Resume loaded. Click Analyze to see AI insights.')
    setAnalysis(null)
  }

  reader.readAsText(file)
}

  const previewText = useMemo(() => {
    if (!resumeText.trim()) return 'Your resume preview will appear here once you paste or upload it.'
    return resumeText.length > 600 ? `${resumeText.slice(0, 600)}…` : resumeText
  }, [resumeText])

  return (
    <div style={styles.page}>
      <Header />
      <ResumeInput
  resumeText={resumeText}
  setResumeText={setResumeText}
  setAnalysis={setAnalysis}
  handleFile={handleFile}
  handleAnalyze={handleAnalyze}
  message={message}
  styles={styles}
/>
<main style={styles.main}>
  <AnalysisResults
  analysis={analysis}
  previewText={previewText}
  styles={styles}
/>
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    background: '#f4f7fd',
    color: '#101827',
    padding: '24px',
  },

  main: {
    display: 'grid',
    gap: 24,
    maxWidth: 1120,
    margin: '0 auto',
    gridTemplateColumns: '1.2fr 0.8fr',
  },
  panel: {
    background: '#fff',
    borderRadius: 24,
    padding: 24,
    boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  panelTitle: {
    margin: 0,
    fontSize: 20,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: 9999,
    background: '#eff6ff',
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: 700,
  },
  textarea: {
    width: '100%',
    minHeight: 320,
    borderRadius: 18,
    border: '1px solid #d1d5db',
    padding: 16,
    fontSize: 15,
    lineHeight: 1.7,
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  uploadButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 18px',
    borderRadius: 14,
    border: '1px solid #cbd5e1',
    background: '#fff',
    cursor: 'pointer',
    color: '#111827',
    fontWeight: 700,
  },
  fileInput: {
    display: 'none',
  },
  analyzeButton: {
    padding: '12px 20px',
    borderRadius: 14,
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  message: {
    marginTop: 16,
    color: '#334155',
    lineHeight: 1.7,
  },
  resultsCard: {
    display: 'grid',
    gap: 20,
  },
  scoreRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
  },
  scoreLabel: {
    margin: 0,
    fontSize: 14,
    color: '#64748b',
  },
  grade: {
    margin: '6px 0 0',
    fontSize: 34,
    color: '#0f172a',
  },
  score: {
    margin: '6px 0 0',
    fontSize: 34,
    color: '#2563eb',
  },
  metrics: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  metricBlock: {
    padding: 16,
    borderRadius: 20,
    background: '#f8fafc',
  },
  metricLabel: {
    margin: 0,
    fontSize: 14,
    color: '#64748b',
  },
  suggestions: {
    padding: 18,
    borderRadius: 20,
    background: '#eff6ff',
  },
  suggestionsTitle: {
    margin: '0 0 12px',
    fontWeight: 700,
  },
  keywords: {
    padding: 18,
    borderRadius: 20,
    background: '#f8fafc',
  },
  keywordList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },
  keywordBadge: {
    padding: '8px 12px',
    borderRadius: 9999,
    background: '#e0f2fe',
    color: '#0369a1',
    fontSize: 13,
    fontWeight: 700,
  },
  previewCard: {
    minHeight: 370,
    padding: 18,
    borderRadius: 20,
    background: '#f8fafc',
  },
  previewText: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    color: '#334155',
    fontSize: 15,
    lineHeight: 1.7,
  },
}

export default App;
