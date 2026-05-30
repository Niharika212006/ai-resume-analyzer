function ResumeInput({
  resumeText,
  setResumeText,
  setAnalysis,
  handleFile,
  handleAnalyze,
  message,
  styles,
}) {
  return (
    <section style={styles.panel}>
      <div style={styles.panelHeader}>
  <h2 style={styles.panelTitle}>Resume Input</h2>
  <span style={styles.badge}>Fast AI Review</span>
</div>

      <textarea
  style={styles.textarea}
        placeholder="Paste your resume text here..."
        value={resumeText}
        onChange={(event) => {
          setResumeText(event.target.value);
          setAnalysis(null);
        }}
      />

      <br />
      <br />

      <input
        type="file"
        accept=".txt,.pdf"
        onChange={handleFile}
      />

      <button onClick={handleAnalyze}>
        Analyze Resume
      </button>

      <p style={styles.message}>{message}</p>
    </section>
  );
}

export default ResumeInput;