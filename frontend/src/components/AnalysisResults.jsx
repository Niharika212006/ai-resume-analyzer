function AnalysisResults({
  analysis,
  previewText,
  styles,
}) {
  return (
    <section style={styles.panel}>
      <h2 style={styles.panelTitle}>Analysis Results</h2>

      {analysis ? (
        <div style={styles.resultsCard}>

          <div style={styles.scoreRow}>
            <div>
              <p style={styles.scoreLabel}>Current ATS Score</p>
              <h3 style={styles.score}>
                {analysis.atsScore || "N/A"}%
              </h3>
            </div>

            <div>
              <p style={styles.scoreLabel}>Potential ATS Score</p>
              <h3 style={styles.score}>
                {analysis.potentialScore || "N/A"}%
              </h3>
            </div>
          </div>

          <div style={styles.suggestions}>
            <p style={styles.suggestionsTitle}>
              Improvement Potential
            </p>

            <p>
              +{(analysis.potentialScore || 0) - (analysis.atsScore || 0)} points
            </p>
          </div>

          <div style={styles.suggestions}>
            <p style={styles.suggestionsTitle}>Professional Summary</p>

            <p>
              {analysis.summary}
            </p>
          </div>

        <div style={styles.suggestions}>
          <p style={styles.suggestionsTitle}>
            Resume Match Score
          </p>

          <h3>
            {analysis.matchScore || 0}%
          </h3>
        </div>
        <div style={styles.suggestions}>
          <p style={styles.suggestionsTitle}>
            Matching Skills
          </p>

          <ul>
            {analysis.matchingSkills?.map((item, index) => (
              <li key={index}>{item}</li>
    ))}
          </ul>
      </div>
          <div style={styles.suggestions}>
            <p style={styles.suggestionsTitle}>Strengths</p>

            <ul>
              {analysis.strengths?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div style={styles.suggestions}>
            <p style={styles.suggestionsTitle}>Weaknesses</p>

            <ul>
              {analysis.weaknesses?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div style={styles.suggestions}>
            <p style={styles.suggestionsTitle}>
              Missing Skills
            </p>

            <ul>
              {analysis.missingSkills?.map((item, index) => (
              <li key={index}>{item}</li>
    ))}
            </ul>
          </div>
          <div style={styles.suggestions}>
            <p style={styles.suggestionsTitle}>Missing Keywords</p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {analysis.missingKeywords?.map((keyword, index) => (
                <span
                  key={index}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "20px",
                    backgroundColor: "#e6f0ff",
                    fontSize: "14px",
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div style={styles.suggestions}>
            <p style={styles.suggestionsTitle}>Suggestions</p>

            <ul>
              {analysis.suggestions?.length > 0 ? (
                analysis.suggestions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>
                  Great job! Your resume already includes strong structure and keywords.
                </li>
              )}
            </ul>
          </div>

        </div>
      ) : (
        <div style={styles.previewCard}>
          <p style={{ marginBottom: 12 }}>Resume preview</p>
          <pre style={styles.previewText}>{previewText}</pre>
        </div>
      )}
    </section>
  )
}

export default AnalysisResults