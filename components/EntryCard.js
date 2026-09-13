const styles = {
  card: {
    marginTop: 48,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
    marginBottom: 12,
  },
  languageLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    color: "#97A1B3",
    margin: 0,
    marginBottom: 4,
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 1.6,
    margin: 0,
    marginBottom: 12,
    color: "#97A1B3",
    whiteSpace: "pre-wrap",
  },
  sectionLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#2EE6A8",
    margin: "20px 0 8px",
  },
  label: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    margin: 0,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    margin: 0,
    color: "#E8EDF2",
  },
};

export default function EntryCard({
  title,
  description,
  howItIsPlayed,
  rules,
  contributor,
  place,
}) {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>
        {title.en} / {title.km}
      </h3>

      <p style={styles.languageLabel}>ENGLISH</p>
      <p style={styles.description}>{description.en}</p>

      <p style={styles.languageLabel}>KHMER</p>
      <p style={styles.description}>{description.km}</p>

      <p style={styles.sectionLabel}>HOW IT IS PLAYED</p>

      <p style={styles.languageLabel}>ENGLISH</p>
      <p style={styles.description}>{howItIsPlayed.en}</p>

      <p style={styles.languageLabel}>KHMER</p>
      <p style={styles.description}>{howItIsPlayed.km}</p>

      <p style={styles.sectionLabel}>RULES</p>

      <p style={styles.languageLabel}>ENGLISH</p>
      <p style={styles.description}>{rules.en}</p>

      <p style={styles.languageLabel}>KHMER</p>
      <p style={styles.description}>{rules.km}</p>

      <p style={styles.label}>CONTRIBUTOR</p>
      <p style={styles.value}>
        {contributor.en} / {contributor.km}
      </p>

      {place && (
        <>
          <p style={styles.label}>PLACE</p>
          <p style={styles.value}>
            {place.en} / {place.km}
          </p>
        </>
      )}
    </div>
  );
}