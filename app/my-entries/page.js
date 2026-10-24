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
    fontFamily: "'Courier New', monospace",
  },
  statusPublished: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#D4EDDA",
    color: "#155724",
    borderRadius: 6,
    fontSize: "13px",
    fontFamily: "'Courier New', monospace",
  },
  statusReturned: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#F8D7DA",
    color: "#721c24",
    borderRadius: 6,
    fontSize: "13px",
    fontFamily: "'Courier New', monospace",
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("entries")
        .select("id, title_en, status")
        .eq("owner", user.id);

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setEntries(data || []);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <main style={styles.wrap}>
        <p style={{ fontSize: "18px" }}>Loading your entries...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={styles.wrap}>
        <p style={{ fontSize: "18px", color: colors.mutedGold }}>
          {error}
        </p>
      </main>
    );
  }

  if (entries.length === 0) {
    return (
      <main style={styles.wrap}>
        <a href="/contribute" style={styles.navLink}>
          ← Back
        </a>
        <p
          style={{
            marginTop: "40px",
            fontSize: "18px",
            color: colors.mutedGold,
          }}
        >
          You have no entries yet. Submit your first contribution!
        </p>
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
          fontWeight: 700,
          color: colors.deepGreen,
          fontFamily: "'Courier New', monospace",
        }}
      >
        My Entries
      </h1>

      {entries.map((entry) => (
        <div key={entry.id} style={styles.card}>
          <h2
            style={{
              margin: "0 0 12px",
              fontSize: "20px",
              fontWeight: 700,
              color: colors.deepGreen,
              lineHeight: 1.3,
            }}
          >
            {entry.title_en || "Untitled"}
          </h2>
          <span style={getStatusStyle(entry.status)}>
            {getStatusLabel(entry.status)}
          </span>
        </div>
      ))}
    </main>
  );
}
