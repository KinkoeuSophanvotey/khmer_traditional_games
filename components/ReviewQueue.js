
"use client";

import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase/client.js";

const colors = {
  deepGreen: "#234F3D",
  warmBeige: "#F3EBDD",
  mutedGold: "#B89452",
};

const styles = {
  page: {
    width: "100%",
    margin: "0",
    padding: "0",
    backgroundColor: "transparent",
    color: colors.deepGreen,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  card: {
    backgroundColor: "#FFFFFF",
    border: `1px solid ${colors.mutedGold}`,
    borderRadius: 12,
    padding: 24,
    marginTop: 16,
  },
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 20,
  },
  approve: {
    backgroundColor: colors.deepGreen,
    color: "#FFFFFF",
    border: "none",
    borderRadius: 6,
    padding: "11px 18px",
    cursor: "pointer",
  },
  return: {
    backgroundColor: "#FFFFFF",
    color: "#8B3030",
    border: "1px solid #8B3030",
    borderRadius: 6,
    padding: "11px 18px",
    cursor: "pointer",
  },
  error: {
    color: "#8B3030",
    backgroundColor: "#FCE8E8",
    padding: 12,
    borderRadius: 6,
    marginTop: 16,
  },
};

export default function ReviewQueue({ entries: initialEntries }) {
  const supabase = createClient();

  const [entries, setEntries] = useState(initialEntries);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");

    if (savedLang === "km" || savedLang === "en") {
      setLang(savedLang);
    }
  }, []);

  async function handleDecision(entry, decision) {
    const action =
      decision === "published"
        ? lang === "km"
          ? "ផ្សាយ"
          : "approve"
        : lang === "km"
          ? "ត្រឡប់ទៅកែសម្រួល"
          : "return";

    const confirmation =
      lang === "km"
        ? `តើអ្នកប្រាកដថាចង់ ${action} ធាតុនេះមែនទេ?`
        : `Are you sure you want to ${action} this entry?`;

    const conf = window.confirm(confirmation);

    if (!conf) return;

    setBusyId(entry.id);
    setError("");

    try {
      const { data, error: reviewError } = await supabase.rpc(
        "review_entry",
        {
          entry_id: entry.id,
          decision,
        }
      );

      if (reviewError) throw reviewError;

      if (data === true) {
        setEntries((prev) =>
          prev.filter((e) => e.id !== entry.id)
        );
      } else {
        setError(
          lang === "km"
            ? "មានបញ្ហាកើតឡើង។ សូមព្យាយាមម្តងទៀត។"
            : "Something went wrong. Please try again."
        );
      }
    } catch (err) {
      console.error("Review error:", err);

      setError(
        lang === "km"
          ? "មានបញ្ហាកើតឡើង។ សូមព្យាយាមម្តងទៀត។"
          : "Something went wrong. Please try again."
      );
    } finally {
      setBusyId(null);
    }
  }

  if (entries.length === 0) {
    return (
      <div style={styles.card}>
        <h2>
          {lang === "km"
            ? "មិនមានការដាក់ស្នើដែលកំពុងរង់ចាំការពិនិត្យទេ។"
            : "No pending entries to review."}
        </h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <p style={{ margin: "0 0 16px" }}>
        <strong>{entries.length}</strong>{" "}
        {lang === "km"
          ? "ការដាក់ស្នើកំពុងរង់ចាំការពិនិត្យ"
          : "submission(s) waiting for review."}
      </p>

      {error && (
        <div style={styles.error}>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      {entries.map((entry) => (
        <article key={entry.id} style={styles.card}>
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: 20,
              color: colors.deepGreen,
            }}
          >
            {entry.title_en || entry.title_kh || "Untitled"}
          </h2>

          {entry.title_kh && entry.title_en && (
            <p lang="km">{entry.title_kh}</p>
          )}

          {entry.description_en && (
            <p>{entry.description_en}</p>
          )}

          {entry.description_kh && (
            <p lang="km">{entry.description_kh}</p>
          )}

          {(entry.how_it_is_played_en ||
            entry.how_it_is_played_kh) && (
            <>
              {entry.how_it_is_played_en && (
                <>
                  <h3>How to play</h3>
                  <p>{entry.how_it_is_played_en}</p>
                </>
              )}

              {entry.how_it_is_played_kh && (
                <>
                  <h3 lang="km">របៀបលេង</h3>
                  <p lang="km">{entry.how_it_is_played_kh}</p>
                </>
              )}
            </>
          )}

          {(entry.rules_en || entry.rules_kh) && (
            <>
              {entry.rules_en && (
                <>
                  <h3>Rules</h3>
                  <p>{entry.rules_en}</p>
                </>
              )}

              {entry.rules_kh && (
                <>
                  <h3 lang="km">ច្បាប់</h3>
                  <p lang="km">{entry.rules_kh}</p>
                </>
              )}
            </>
          )}

          {(entry.contributor_en || entry.contributor_kh) && (
            <div>
              <h3>Contributor</h3>

              {entry.contributor_en && (
                <p>English: {entry.contributor_en}</p>
              )}

              {entry.contributor_kh && (
                <p lang="km">ខ្មែរ៖ {entry.contributor_kh}</p>
              )}
            </div>
          )}

          {(entry.place_en || entry.place_kh) && (
            <div>
              <h3>Place</h3>

              {entry.place_en && (
                <p>English: {entry.place_en}</p>
              )}

              {entry.place_kh && (
                <p lang="km">ខ្មែរ៖ {entry.place_kh}</p>
              )}
            </div>
          )}

          {entry.photo_url && (
            <img
              src={entry.photo_url}
              alt={entry.title_en || entry.title_kh || "Submitted game"}
              style={{
                display: "block",
                maxWidth: "100%",
                maxHeight: 350,
                objectFit: "contain",
                marginTop: 16,
                borderRadius: 8,
              }}
            />
          )}

          {entry.created_at && (
            <p
              style={{
                color: "#666",
                fontSize: 14,
                margin: "12px 0 0",
              }}
            >
              {lang === "km"
                ? "កាលបរិច្ឆេទដាក់ស្នើ៖ "
                : "Submitted: "}
              {new Date(entry.created_at).toLocaleDateString()}
            </p>
          )}

          <div style={styles.buttonRow}>
            <button
              type="button"
              style={{
                ...styles.approve,
                opacity: busyId === entry.id ? 0.6 : 1,
              }}
              disabled={busyId !== null}
              onClick={() =>
                handleDecision(entry, "published")
              }
            >
              {busyId === entry.id
                ? lang === "km"
                  ? "កំពុងដំណើរការ..."
                  : "Processing..."
                : lang === "km"
                  ? "យល់ព្រម & ផ្សាយ"
                  : "Approve & Publish"}
            </button>

            <button
              type="button"
              style={{
                ...styles.return,
                opacity: busyId === entry.id ? 0.6 : 1,
              }}
              disabled={busyId !== null}
              onClick={() =>
                handleDecision(entry, "returned")
              }
            >
              {lang === "km"
                ? "ត្រឡប់ទៅកែសម្រួល"
                : "Return for revision"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
