
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
      '"Noto Sans Khmer", "Noto Sans", Arial, sans-serif',
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  navLink: {
    color: colors.deepGreen,
    textDecoration: "none",
    fontSize: "14px",

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

function getStatusLabel(status, lang) {
  switch (status) {
    case "published":
      return lang === "en" ? "Published" : "បានផ្សាយ";

    case "returned":
      return lang === "en"
        ? "Returned for revision"
        : "បានបញ្ជូនត្រឡប់ដើម្បីកែសម្រួល";

    case "pending":
    default:
      return lang === "en"
        ? "Pending review"
        : "កំពុងរង់ចាំការត្រួតពិនិត្យ";
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
  const [lang, setLang] = useState("en");

  const t = (english, khmer) =>
    lang === "en" ? english : khmer;

  // Load the saved website language
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang === "km" ? "km" : "en");
  }, []);

  // Load the user's entries
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
          .select("id, title_en, title_kh, status, created_at")
          .eq("owner", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        setEntries(data || []);
      } catch (err) {
        console.error("Error loading entries:", err);
        setError(
          err.message ||
            "Unable to load your entries."
        );
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
    const entryTitle =
      (lang === "en"
        ? entry.title_en
        : entry.title_kh) || "Untitled";

    const confirmed = window.confirm(
      t(
        `Are you sure you want to delete "${entryTitle}"? This action cannot be undone.`,
        `តើអ្នកប្រាកដថាចង់លុប "${entryTitle}" មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`
      )
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
      console.error("Error deleting entry:", err);

      setError(
        t(
          "Unable to delete this entry. Please try again.",
          "មិនអាចលុបទិន្នន័យហ្គេមនេះបានទេ។ សូមព្យាយាមម្តងទៀត។"
        )
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main style={styles.wrap}>
        <p>{t("Loading your entries...", "កំពុងផ្ទុកទិន្នន័យហ្គេមរបស់អ្នក...")}</p>
      </main>
    );
  }

  if (error && entries.length === 0) {
    return (
      <main style={styles.wrap}>
        <a href="/" style={styles.navLink}>
          {t("← Home", "← ទំព័រដើម")}
        </a>

        <p style={{ color: "#b00020", marginTop: 24 }}>
          {error}
        </p>
      </main>
    );
  }

  return (
    <main style={styles.wrap}>
      <a href="/" style={styles.navLink}>
        {t("← Home", "← ទំព័រដើម")}
      </a>

      <h1
        style={{
          margin: "24px 0 16px",
          fontSize: "28px",
          fontWeight: 600,
          color: colors.deepGreen,

        }}
      >
        {t("My Entries", "ទិន្នន័យល្បែងប្រជាប្រិយរបស់ខ្ញុំ")}
      </h1>

      {error && (
        <p style={{ color: "#b00020", marginBottom: 16 }}>
          {error}
        </p>
      )}

      {entries.length === 0 ? (
        <div>
          <p style={{ color: "#666", marginTop: 24 }}>
            {t(
              "You have no entries yet. Submit your first contribution!",
              "អ្នកមិនទាន់មានទិន្នន័យហ្គេមនៅឡើយទេ។ សូមចែករំលែកហ្គេមដំបូងរបស់អ្នក!"
            )}
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
              fontFamily: "inherit",
            }}
          >
            {t("Contribute an Entry", "ចែករំលែកទិន្នន័យហ្គេម")}
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
                lineHeight: 1.7,
                fontFamily: "inherit",
              }}
            >
              {(lang === "en"
                ? entry.title_en
                : entry.title_kh) || "Untitled"}
            </h2>

            <span style={getStatusStyle(entry.status)}>
              {getStatusLabel(entry.status, lang)}
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
                  fontFamily: "inherit",
                }}
              >
                {t("Edit", "កែសម្រួល")}
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
                  fontFamily: "inherit",
                }}
              >
                {deletingId === entry.id
                  ? t("Deleting...", "កំពុងលុប...")
                  : t("Delete", "លុប")}
              </button>
            </div>
          </div>
        ))
      )}
    </main>
  );
}
