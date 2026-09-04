"use client";

import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard";
import { useState } from "react";
import entries from "../data/entries.js";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "80px 24px",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#2EE6A8",
    fontSize: 14,
    letterSpacing: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    margin: "16px 0 12px",
    lineHeight: 1.1,
  },
  description: {
    fontSize: 18,
    color: "#97A1B3",
    lineHeight: 1.6,
    margin: 0,
  },
  card: {
    marginTop: 48,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    margin: 0,
  },
  cardValue: {
    fontSize: 16,
    margin: "6px 0 0",
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: "#2EE6A8",
    marginTop: 48,
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid #2E3644",
    fontSize: 13,
    color: "#5A6373",
  },
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter((entry) => {
    const search = searchTerm.toLowerCase();
    return (
      entry.title.toLowerCase().includes(search) ||
      entry.description.toLowerCase().includes(search)
    );
  });

  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.description}>{collection.description}</p>

      <input
        type="text"
        placeholder="Search games..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          margin: '16px 0 16px',
          padding: '12px 16px',
          backgroundColor: '#1C222C',
          border: '1px solid #2E3644',
          borderRadius: '8px',
          color: '#E8EDF2',
          fontSize: '16px',
        }}
      />

      <div style={styles.card}>
        <p style={styles.cardLabel}>CURATED BY</p>
        <p style={styles.cardValue}>{collection.curator}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>SOURCE</p>
        <p style={styles.cardValue}>{collection.source}</p>
      </div>

            {filteredEntries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: '#97A1B3' }}>
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>No games found matching your search.</p>
          <p style={{ fontSize: '16px' }}>រកមិនឃើញល្បែងដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។</p>
        </div>
      ) : (
        filteredEntries.map((entry, index) => (
          <EntryCard
            key={index}
            title={entry.title}
            description={`${entry.description}\n\nHow it is played: ${entry.howItIsPlayed}\n\nRules: ${entry.rules}`}
            contributor={entry.contributor}
            place={entry.place}
          />
        ))
      )}
      <p style={styles.count}>Entries in the archive: {filteredEntries.length}</p>
      <footer style={styles.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>
    </main>
  );
}
