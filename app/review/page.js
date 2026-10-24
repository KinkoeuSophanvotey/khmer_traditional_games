
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client.js";

const colors = {
  deepGreen: "#234F3D",
  warmBeige: "#F3EBDD",
  mutedGold: "#B89452",
};

const styles = {
  page: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: "48px 24px",
    backgroundColor: colors.warmBeige,
    color: colors.deepGreen,
    minHeight: "100vh",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  link: {
    color: colors.deepGreen,
    textDecoration: "none",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    border: `1px solid ${colors.mutedGold}`,
    borderRadius: 12,
    padding: 24,
    marginTop: 20,
  },
  badge: {
    display: "inline-block",
    padding: "5px 12px",
    borderRadius: 6,
    backgroundColor: "#FFF3CD",
    color: "#856404",
    fontSize: 13,
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
  message: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    marginTop: 16,
  },
};

export default function ReviewPage() {
  const supabase = createClient();
  const router = useRouter();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: isReviewer, error: reviewerError } =
        await supabase.rpc("is_reviewer");

      if (reviewerError) throw reviewerError;

      if (isReviewer !== true) {
        setEntries([]);
        setError("Access denied. Only authorized reviewers can access this page.");
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("entries")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true });

      if (fetchError) throw fetchError;

      setEntries(data || []);
    } catch (err) {
      console.error("Error loading review entries:", err);
      setError(err.message || "Could not load submissions.");
    } finally {
      setLoading(false);
    }
  }, [router, supabase]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  async function handleDecision(entry, decision) {
    const action = decision === "published" ? "approve" : "return";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this entry?`
    );

    if (!confirmed) return;

    setBusyId(entry.id);
    setError("");
    setMessage("");

    try {
      const { data, error: reviewError } = await supabase.rpc(
        "review_entry",
        {
          entry_id: entry.id,
          decision,
        }
      );

      if (reviewError) throw reviewError;

      if (data !== true) {
        throw new Error(
          "The review action was not completed. The entry may no longer be pending, or your reviewer permission may be missing."
        );
      }

      setEntries((current) =>
        current.filter((item) => item.id !== entry.id)
      );

      setMessage(
        decision === "published"
          ? `"${entry.title_en || entry.title_kh || "Entry"}" was approved and published.`
          : `"${entry.title_en || entry.title_kh || "Entry"}" was returned for revision.`
      );
    } catch (err) {
      console.error("Error reviewing entry:", err);
      setError(err.message || "Could not process this review.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main style={styles.page}>
      <a href="/" style={styles.link}>
        ← Home
      </a>

      <h1 style={{ marginTop: 28 }}>Review Submissions</h1>
      <p>
        Review pending contributions before they appear in the public archive.
      </p>

      {message && (
        <div role="status" style={styles.message}>
          {message}
        </div>
      )}

      {error && (
        <div role="alert" style={styles.message}>
          <strong>Notice:</strong> {error}
          {!error.startsWith("Access denied") && (
            <button
              type="button"
              onClick={loadEntries}
              style={{ ...styles.approve, marginLeft: 12 }}
            >
              Try again
            </button>
          )}
        </div>
      )}

      {loading ? (
        <p>Checking reviewer access and loading submissions...</p>
      ) : error.startsWith("Access denied") ? null : entries.length === 0 ? (
        <div style={styles.card}>
          <h2>No pending submissions</h2>
          <p>There are no entries waiting for review right now.</p>
        </div>
      ) : (
        <>
          <p>
            <strong>{entries.length}</strong> submission(s) waiting for review.
          </p>

          {entries.map((entry) => (
            <article key={entry.id} style={styles.card}>
              <span style={styles.badge}>Pending review</span>

              <h2 style={{ marginTop: 16 }}>
                {entry.title_en || entry.title_kh || "Untitled entry"}
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

              {(entry.contributor_en || entry.contributor_kh) && (
                <div>
                    <h3>Contributor</h3>
                    {entry.contributor_en && <p>English: {entry.contributor_en}</p>}
                    {entry.contributor_kh && (
                    <p lang="km">ខ្មែរ៖ {entry.contributor_kh}</p>
                    )}
                </div>
              )}

              {(entry.place_en || entry.place_kh) && (
                <div>
                    <h3>Place</h3>
                    {entry.place_en && <p>English: {entry.place_en}</p>}
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

              <div style={styles.buttonRow}>
                <button
                  type="button"
                  style={{
                    ...styles.approve,
                    opacity: busyId === entry.id ? 0.6 : 1,
                  }}
                  disabled={busyId !== null}
                  onClick={() => handleDecision(entry, "published")}
                >
                  {busyId === entry.id ? "Processing..." : "Approve & Publish"}
                </button>

                <button
                  type="button"
                  style={{
                    ...styles.return,
                    opacity: busyId === entry.id ? 0.6 : 1,
                  }}
                  disabled={busyId !== null}
                  onClick={() => handleDecision(entry, "returned")}
                >
                  Return for revision
                </button>
              </div>
            </article>
          ))}
        </>
      )}
    </main>
  );
}
