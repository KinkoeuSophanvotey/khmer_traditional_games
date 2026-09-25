"use client";

import { useEffect, useState } from "react";
import collection from "../../collection.config.js";
import EntryCard from "../../components/EntryCard";
import entries from "../../data/entries.js";

const colors = {
  deepGreen: "#234F3D",
  warmBeige: "#F3EBDD",
  mutedGold: "#B89452",
};

export default function Games() {
  const [searchTerm, setSearchTerm] = useState("");
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
  }, []);

  const filteredEntries = entries.filter((entry) => {
    let search = searchTerm.toLowerCase().trim().replace(/^"|"$/g, "");

    if (
      (search.startsWith('"') && search.endsWith('"')) ||
      (search.startsWith("'") && search.endsWith("'"))
    ) {
      search = search.slice(1, -1).trim();
    }

    if (search === "") return true;

    const text = [
      entry.title.en,
      entry.title.km,
      entry.description.en,
      entry.description.km,
      entry.howItIsPlayed.en,
      entry.howItIsPlayed.km,
      entry.rules.en,
      entry.rules.km,
      entry.contributor.en,
      entry.contributor.km,
      entry.place.en,
      entry.place.km,
    ]
      .join(" ")
      .toLowerCase();

    return text.includes(search);
  });

  return (
    <>
      <style>{`
        .games-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @media (max-width: 900px) {
          .games-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .games-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <main
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 24px",
          backgroundColor: colors.warmBeige,
          minHeight: "100vh",
          boxSizing: "border-box",
          color: colors.deepGreen,
        }}
      >
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 0",
            borderBottom: `1px solid ${colors.mutedGold}`,
          }}
        >
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            {lang === "en" ? "KHMER LIVING ARCHIVE" : "មរតកល្បែងប្រពៃណីខ្មែរ"}
          </div>

          <div
            style={{
              display: "flex",
              gap: "28px",
              alignItems: "center",
            }}
          >
            <a
              href="/"
              style={{
                color: colors.deepGreen,
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              {lang === "en" ? "Home" : "ទំព័រដើម"}
            </a>

            <a
              href="/games"
              style={{
                color: colors.deepGreen,
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              {lang === "en" ? "Games" : "ល្បែងប្រពៃណីខ្មែរ"}
            </a>
          </div>
        </nav>

        <section
          style={{
            padding: "64px 0 40px",
            borderBottom: `1px solid ${colors.mutedGold}`,
          }}
        >
          <p
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "12px",
              letterSpacing: "1.5px",
              color: colors.mutedGold,
              margin: "0 0 14px",
            }}
          >
            {lang === "en"
              ? "THE COLLECTION"
              : "បណ្តុំល្បែងប្រជាប្រិយ"}
          </p>

          <h1
            style={{
              fontSize: "48px",
              lineHeight: 1.1,
              margin: "0 0 16px",
              color: colors.deepGreen,
            }}
          >
            {lang === "en"
              ? "Khmer Traditional Games"
              : "ល្បែងប្រពៃណីខ្មែរ"}
          </h1>

          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.7,
              margin: 0,
              maxWidth: "680px",
            }}
          >
            {lang === "en"
              ? "Explore traditional Khmer games, including how they were played, their rules, and the people and places connected to them."
              : "ស្វែងយល់អំពីល្បែងប្រពៃណីខ្មែរ រួមទាំងរបៀបលេង ច្បាប់ល្បែង និងមនុស្សនិងទីកន្លែងដែលពាក់ព័ន្ធនឹងល្បែងទាំងនេះ។"}
          </p>
        </section>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            marginTop: "32px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              position: "relative",
              flex: 1,
              minWidth: "260px",
            }}
          >
            <input
              type="text"
              placeholder={
                lang === "en" ? "Search games..." : "ស្វែងរកល្បែង..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px 44px 14px 16px",
                backgroundColor: colors.warmBeige,
                border: `1px solid ${colors.mutedGold}`,
                borderRadius: "8px",
                color: colors.deepGreen,
                fontSize: "16px",
              }}
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: colors.mutedGold,
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "14px",
            color: colors.mutedGold,
            margin: "24px 0",
          }}
        >
          {lang === "en"
            ? `${filteredEntries.length} games in the archive`
            : `ល្បែង ${filteredEntries.length} នៅក្នុងបណ្ណសារ`}
        </p>

        {filteredEntries.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "64px 24px",
              color: colors.deepGreen,
            }}
          >
            <p style={{ fontSize: "18px", marginBottom: "8px" }}>
              {lang === "en"
                ? "No games found matching your search."
                : "រកមិនឃើញល្បែងដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។"}
            </p>
          </div>
        ) : (
          <div className="games-grid">
            {filteredEntries.map((entry) => {
              const originalIndex = entries.indexOf(entry);

              return (
                <EntryCard
                  key={originalIndex}
                  title={entry.title}
                  description={entry.description}
                  howItIsPlayed={entry.howItIsPlayed}
                  rules={entry.rules}
                  contributor={entry.contributor}
                  place={entry.place}
                  index={originalIndex}
                  lang={lang}
                />
              );
            })}
          </div>
        )}

        <footer
          style={{
            marginTop: "80px",
            padding: "32px 0",
            borderTop: `1px solid ${colors.mutedGold}`,
            fontSize: "13px",
            color: colors.mutedGold,
            textAlign: "center",
          }}
        >
          Built in ICT 340 — Vibe Coding, American University of Phnom Penh,
          Fall 2026. This archive is under construction all semester. Come
          back in December.
        </footer>
      </main>
    </>
  );
}