import { useMemo, useState } from 'react'
import Header from "./components/Header";
import ResumeInput from "./components/ResumeInput";
import AnalysisResults from "./components/AnalysisResults";
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import mammoth from "mammoth"
import { jsPDF } from "jspdf"
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
  const [jobDescription, setJobDescription] = useState('')
  const [message, setMessage] = useState('Paste your resume text or upload a .txt file to get AI-powered insights.')
  const [jobRole, setJobRole] = useState('Software Engineer')
  const [loading, setLoading] = useState(false)

const handleAnalyze = async () => {
  if (!resumeText.trim()) {
    setMessage('Please paste your resume content first.')
    setAnalysis(null)
    return
  }
  setLoading(true)

  try {
    setMessage('Analyzing resume...')

    const response = await fetch(
  'https://ai-resume-analyzer-fvm4.onrender.com/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeText: resumeText,
        jobRole: jobRole,
        jobDescription: jobDescription,
      }),
    })

    const data = await response.json()

    setAnalysis(data)
    setLoading(false)
    setMessage(
      'Resume analysis complete. Review the score and suggestions below.'
    )
  } catch (error) {
    console.error(error)
    setMessage('Failed to connect to backend.')
    setAnalysis(null)
    setLoading(false)
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
if (
  file.type ===
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
) {
  const arrayBuffer = await file.arrayBuffer()

  const result = await mammoth.extractRawText({
    arrayBuffer,
  })

  setResumeText(result.value)

  setMessage("DOCX resume loaded successfully.")

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

const downloadReport = () => {
  if (!analysis) return

  const doc = new jsPDF()

  let y = 20
  if (y > 250) {
  doc.addPage()
  y = 20
}
  doc.setFontSize(20)
doc.text("AI Resume Analyzer", 20, y)

y += 10

doc.setFontSize(12)

doc.text(
  `Generated: ${new Date().toLocaleDateString()}`,
  20,
  y
)

y += 10

doc.text(
  `Target Role: ${jobRole}`,
  20,
  y
)

y += 15

  y += 15

  doc.setFontSize(12)

  doc.text(
    `Current ATS Score: ${analysis.atsScore}%`,
    20,
    y
  )

  y += 10

  doc.text(
    `Potential ATS Score: ${analysis.potentialScore}%`,
    20,
    y
  )

  y += 10
  doc.text(
  `Resume Match Score: ${analysis.matchScore || 0}%`,
  20,
  y
)
y += 10
  doc.text(
    `Improvement Potential: +${
      analysis.potentialScore - analysis.atsScore
    } points`,
    20,
    y
  )

  y += 20
  if (y > 250) {
  doc.addPage()
  y = 20
}
  doc.setFontSize(14)
  doc.text("Professional Summary", 20, y)

  y += 10

  doc.setFontSize(12)

  const summaryLines = doc.splitTextToSize(
    analysis.summary || "",
    170
  )

  doc.text(summaryLines, 20, y)

  y += summaryLines.length * 7 + 10
  if (y > 250) {
  doc.addPage()
  y = 20
}
  doc.setFontSize(14)
  doc.text("Strengths", 20, y)

  y += 10

  doc.setFontSize(12)

  analysis.strengths?.forEach((item) => {
    doc.text(`• ${item}`, 25, y)
    y += 8
  })

  y += 5
  if (y > 250) {
  doc.addPage()
  y = 20
}
  doc.setFontSize(14)
  doc.text("Weaknesses", 20, y)

  y += 10

  doc.setFontSize(12)

  analysis.weaknesses?.forEach((item) => {
    doc.text(`• ${item}`, 25, y)
    y += 8
  })

  y += 5
  if (y > 250) {
  doc.addPage()
  y = 20
}
  doc.setFontSize(14)
  doc.text("Missing Keywords", 20, y)

  y += 10

  doc.setFontSize(12)

  analysis.missingKeywords?.forEach((item) => {
    doc.text(`• ${item}`, 25, y)
    y += 8
  })

  y += 5
  if (y > 250) {
  doc.addPage()
  y = 20
}
  doc.setFontSize(14)
  doc.text("Suggestions", 20, y)

  y += 10

  doc.setFontSize(12)

  analysis.suggestions?.forEach((item) => {
    doc.text(`• ${item}`, 25, y)
    y += 8
  })

  doc.save("ATS_Report.pdf")
}
  const previewText = useMemo(() => {
    if (!resumeText.trim()) return 'Your resume preview will appear here once you paste or upload it.'
    return resumeText.length > 600 ? `${resumeText.slice(0, 600)}…` : resumeText
  }, [resumeText])

  return (
    <div style={styles.page}>
      <Header />
      <div style={{ marginBottom: '20px' }}>
  <label>
    Target Role:
  </label>

  <select
    value={jobRole}
    onChange={(e) => setJobRole(e.target.value)}
    style={{
      marginLeft: '10px',
      padding: '8px'
    }}
  >
    <option>Software Engineer</option>
    <option>AI/ML Engineer</option>
    <option>Frontend Developer</option>
    <option>Backend Developer</option>
    <option>Data Analyst</option>
    <option>Java Developer</option>
  </select>
</div>
<div style={{ marginBottom: '20px' }}>
  <label>
    Job Description:
  </label>

  <textarea
    value={jobDescription}
    onChange={(e) => setJobDescription(e.target.value)}
    placeholder="Paste job description here..."
    style={{
      width: '100%',
      minHeight: '150px',
      marginTop: '10px',
      padding: '10px',
      borderRadius: '8px',
    }}
  />
</div>
      <ResumeInput
  resumeText={resumeText}
  setResumeText={setResumeText}
  setAnalysis={setAnalysis}
  handleFile={handleFile}
  handleAnalyze={handleAnalyze}
  message={message}
  styles={styles}
/><main style={styles.main}>
  {loading && (
  <div
    style={{
      padding: "20px",
      marginBottom: "20px",
      borderRadius: "12px",
      background: "#eff6ff",
      fontWeight: "bold",
    }}
  >
    🤖 Reading Resume...
    <br />
    📊 Calculating ATS Score...
    <br />
    🔍 Matching with Job Description...
    <br />
    📝 Generating Suggestions...
  </div>
)}
  <AnalysisResults
    analysis={analysis}
    previewText={previewText}
    styles={styles}
  />

  {analysis && (
    <button
      onClick={downloadReport}
      style={{
        marginTop: "20px",
        padding: "12px 20px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      Download ATS Report
    </button>
  )}
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
