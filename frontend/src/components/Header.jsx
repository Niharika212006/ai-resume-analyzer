function Header() {
  return (
    <header style={styles.header}>
      <div>
        <p style={styles.label}>AI Resume Analyzer</p>

        <h1 style={styles.title}>
          Polish your resume with instant AI feedback
        </h1>

        <p style={styles.subtitle}>
          Upload or paste your resume, then get a score,
          keyword match insights, and improvement suggestions.
        </p>
      </div>
    </header>
  );
}

const styles = {
  header: {
    maxWidth: 1120,
    margin: '0 auto 24px',
  },

  label: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: 9999,
    background: '#eef2ff',
    color: '#4338ca',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },

  title: {
    margin: '16px 0 12px',
    fontSize: 'clamp(2rem, 3vw, 3rem)',
    lineHeight: 1.05,
  },

  subtitle: {
    maxWidth: 720,
    fontSize: 16,
    lineHeight: 1.75,
    color: '#475569',
  },
};

export default Header;