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
  description: {
    fontSize: 14,
    lineHeight: 1.6,
    margin: 0,
    marginBottom: 12,
    color: "#97A1B3",
    // pre-wrap preserves line breaks in description text
    whiteSpace: "pre-wrap",
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

export default function EntryCard({ title, description, contributor, place }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.description}>{description}</p>
      <p style={styles.label}>CONTRIBUTOR</p>
      <p style={styles.value}>{contributor}</p>
      {place && (
        <>
          <p style={styles.label}>PLACE</p>
          <p style={styles.value}>{place}</p>
        </>
      )}
    </div>
  );
}