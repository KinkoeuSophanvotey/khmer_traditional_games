"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client.js";

const colors = {
  deepGreen: "#234F3D",
  warmBeige: "#F3EBDD",
  mutedGold: "#B89452",
};

const styles = {
  wrap: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "60px 24px",
    backgroundColor: colors.warmBeige,
    color: colors.deepGreen,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  navLink: {
    color: colors.deepGreen,
    textDecoration: "none",
    fontSize: "14px",
    fontFamily: "'Courier New', monospace",
  },
  card: {
    backgroundColor: "#FFFFFF",
    border: `1px solid ${colors.mutedGold}`,
    borderRadius: 16,
    padding: "24px",
    marginBottom: "16px",
  },
  statusPending: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#FFF3CD",
    color: "#856404",
    borderRadius: 6,
    fontSize: "13px",

  },
  statusPublished: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#D4EDDA",
    color: "#155724",
    borderRadius: 6,
    fontSize: "13px",

  },
  statusReturned: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#F8D7DA",
    color: "#721c24",
    borderRadius: 6,
    fontSize: "13px",

  },
};

function getStatusLabel(status) {
  switch (status) {
    case "published":
      return "Published";
    case "returned":
      return "Returned for revision";
    case "pending":
    default:
      return "Pending review";
  }
}

function getStatusStyle(status) {
  switch (status) {
    case "published":
      return styles.statusPublished;
    case "returned":
      return styles.statusReturned;
    case "pending":
    default:
      return styles.statusPending;
  }
}

export default function MyEntriesPage() {
  const supabase = createClient();
  const router = useRouter();

  const [entries, setEntries] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          router.push("/login");
          return;
        }

        setUserId(user.id);

        const { data, error: fetchError } = await supabase
          .from("entries")
          .select("id, title_en, status, created_at")
          .eq("owner", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        setEntries(data || []);
      } catch (err) {
        setError(err.message || "Unable to load your entries.");
      } finally {
        setLoading(false);

      }

    }

    loadData();
  }, []);

  const handleEdit = (entryId) => {
    router.push(`/edit?id=${encodeURIComponent(entryId)}`);
  };

  const handleDelete = async (entry) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${entry.title_en || "Untitled"}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(entry.id);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from("entries")
        .delete()
        .eq("id", entry.id)
        .eq("owner", userId);

      if (deleteError) throw deleteError;

      setEntries((currentEntries) =>
        currentEntries.filter((item) => item.id !== entry.id)
      );
    } catch (err) {
      setError(
        err.message || "Unable to delete this entry. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main style={styles.wrap}>
        <p>Loading your entries...</p>
      </main>
    );
  }

  if (error && entries.length === 0) {
    return (
      <main style={styles.wrap}>
        <a href="/" style={styles.navLink}>
          ← Home
        </a>
        <p style={{ color: "#b00020", marginTop: 24 }}>{error}</p>
      </main>
    );
  }

  return (
    <main style={styles.wrap}>
      <a href="/" style={styles.navLink}>
        ← Home
      </a>

      <h1
        style={{
          margin: "24px 0 16px",
          fontSize: "28px",
          fontWeight: 600,
          color: colors.deepGreen,
          fontFamily: "'Courier New', monospace",
        }}
      >
        My Entries
      </h1>

      {error && (
        <p style={{ color: "#b00020", marginBottom: 16 }}>
          {error}
        </p>
      )}

      {entries.length === 0 ? (
        <div>
          <p style={{ color: "#666", marginTop: 24 }}>
            You have no entries yet. Submit your first contribution!
          </p>
          <button
            onClick={() => router.push("/contribute")}
            style={{
              marginTop: 12,
              padding: "10px 18px",
              backgroundColor: colors.deepGreen,
              color: "#FFFFFF",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Contribute an Entry
          </button>
        </div>
      ) : (
        entries.map((entry) => (
          <div key={entry.id} style={styles.card}>
            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "19px",
                fontWeight: 500,
                color: colors.deepGreen,
                lineHeight: 1.5,
              }}
            >
              {entry.title_en || "Untitled"}
            </h2>

            <span style={getStatusStyle(entry.status)}>
              {getStatusLabel(entry.status)}
            </span>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 18,
              }}
            >
              <button
                onClick={() => handleEdit(entry.id)}
                disabled={deletingId === entry.id}
                style={{
                  padding: "9px 18px",
                  backgroundColor: colors.deepGreen,
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(entry)}
                disabled={deletingId === entry.id}
                style={{
                  padding: "9px 18px",
                  backgroundColor: "#FFFFFF",
                  color: "#B02A37",
                  border: "1px solid #B02A37",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                {deletingId === entry.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))
      )}
    </main>
  );
}
