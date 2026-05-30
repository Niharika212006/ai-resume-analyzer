function AnalysisResults({
  analysis,
  previewText,
  styles,
})
{
  return (
  <section style={styles.panel}>
    <h2 style={styles.panelTitle}>Analysis Results</h2>

    {analysis ? (
      <div style={styles.resultsCard}>
        <div style={styles.scoreRow}>
          <div>
            <p style={styles.scoreLabel}>Overall Grade</p>
            <h3 style={styles.grade}>{analysis.grade}</h3>
          </div>

          <div>
            <p style={styles.scoreLabel}>AI Score</p>
            <h3 style={styles.score}>{analysis.score}%</h3>
          </div>
        </div>

        <div style={styles.metrics}>
          <div style={styles.metricBlock}>
            <p style={styles.metricLabel}>Word count</p>
            <strong>{analysis.wordCount}</strong>
          </div>

          <div style={styles.metricBlock}>
            <p style={styles.metricLabel}>Keyword matches</p>
            <strong>{analysis.keywordMatches.length}</strong>
          </div>
        </div>

        <div style={styles.suggestions}>
          <p style={styles.suggestionsTitle}>Suggestions</p>

          <ul>
            {analysis.suggestions.length > 0 ? (
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

        {analysis.keywordMatches.length > 0 && (
          <div style={styles.keywords}>
            <p style={styles.suggestionsTitle}>Detected keywords</p>

            <div style={styles.keywordList}>
              {analysis.keywordMatches.map((keyword) => (
                <span key={keyword} style={styles.keywordBadge}>
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    ) : (
      <div style={styles.previewCard}>
        <p style={{ marginBottom: 12 }}>Resume preview</p>
        <pre style={styles.previewText}>{previewText}</pre>
      </div>
    )}
  </section>
);
}

export default AnalysisResults;