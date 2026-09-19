"use client";

import collection from "../collection.config.js";

import { useEffect, useState } from "react";

const colors = {
  deepGreen: "#234F3D",
  warmBeige: "#F3EBDD",
  mutedGold: "#B89452",
};

const styles = {
  wrap: {
    maxWidth: 1080,
    margin: "0 auto",
    padding: "0 24px",
    backgroundColor: colors.warmBeige,
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "48px",
    alignItems: "center",
    padding: "96px 0 72px",
    borderBottom: `1px solid ${colors.mutedGold}`,
  },
  heroTitle: {
    fontSize: 64,
    fontWeight: 700,
    color: colors.deepGreen,
    margin: "0 0 24px",
    lineHeight: 1.05,
    letterSpacing: -1,
  },
  heroDescription: {
    fontSize: 19,
    color: colors.mutedGold,
    lineHeight: 1.7,
    margin: "0 0 32px",
  },
  heroImageArea: {
    aspectRatio: "4/3",
    backgroundColor: colors.deepGreen,
    border: `2px dashed ${colors.mutedGold}`,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.warmBeige,
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    letterSpacing: 1,
  },
  exploreButton: {
    display: "inline-block",
    padding: "16px 32px",
    backgroundColor: colors.deepGreen,
    color: colors.warmBeige,
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
    fontFamily: "'Courier New', monospace",
  },
  section: {
    padding: "64px 0",
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: 700,
    color: colors.deepGreen,
    margin: "0 0 16px",
    lineHeight: 1.2,
  },
  aboutText: {
    fontSize: 16,
    color: colors.mutedGold,
    lineHeight: 1.7,
    margin: 0,
  },
  exploreBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px",
    paddingBottom: "24px",
    borderBottom: `1px solid ${colors.mutedGold}`,
  },
  langToggle: {
    padding: "10px 20px",
    backgroundColor: colors.deepGreen,
    color: colors.warmBeige,
    border: "none",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Courier New', monospace",
  },
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    margin: "16px 0",
    padding: "14px 18px",
    paddingRight: "44px",
    backgroundColor: colors.warmBeige,
    border: `1px solid ${colors.mutedGold}`,
    borderRadius: 10,
    color: colors.deepGreen,
    fontSize: "16px",
    fontFamily: "inherit",
  },
  clearButton: {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: colors.mutedGold,
    fontSize: "20px",
    cursor: "pointer",
    padding: "4px",
    lineHeight: 1,
  },
  entryList: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: colors.mutedGold,
    marginTop: 48,
    textAlign: "center",
  },
  footer: {
    marginTop: 80,
    paddingTop: 32,
    borderTop: `1px solid ${colors.mutedGold}`,
    fontSize: 13,
    color: colors.mutedGold,
    textAlign: "center",
  },
  noResults: {
    textAlign: "center",
    padding: "60px 24px",
    color: colors.mutedGold,
  },
};

export default function Home() {
  
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
  }, []);

  return (
    <main style={styles.wrap}>
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
          color: colors.deepGreen,
        }}
      >
        KHMER LIVING ARCHIVE
      </div>

      <div
        style={{
          display: "flex",
          gap: "28px",
          alignItems: "center",
        }}
      >
        <a
          href="#home"
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
          }}
        >
          {lang === "en" ? "Games" : "ល្បែង"}
        </a>

      </div>
    </nav>
      <section
        id="home"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "56px",
          alignItems: "center",
          padding: "80px 0",
          borderBottom: `1px solid ${colors.mutedGold}`,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "12px",
              letterSpacing: "1.5px",
              color: colors.mutedGold,
              margin: "0 0 16px",
            }}
          >
            {lang === "en"
              ? "KHMER CULTURAL HERITAGE"
              : "បេតិកភណ្ឌវប្បធម៌ខ្មែរ"}
          </p>

          <h1
            style={{
              fontSize: "60px",
              lineHeight: 1.05,
              color: colors.deepGreen,
              margin: "0 0 24px",
            }}
          >
            {lang === "en"
              ? "Khmer Traditional Games"
              : "ល្បែងប្រពៃណីខ្មែរ"}
          </h1>

          <p
            style={{
              fontSize: "19px",
              lineHeight: 1.7,
              color: colors.deepGreen,
              margin: "0 0 28px",
              maxWidth: "520px",
            }}
          >
            {lang === "en"
              ? "Discover traditional Khmer games passed down through generations, including how they were played and the stories behind them."
              : "ស្វែងយល់អំពីល្បែងប្រពៃណីខ្មែរដែលបានបន្តពីជំនាន់មួយទៅជំនាន់មួយ រួមទាំងរបៀបលេង និងរឿងរ៉ាវនៅពីក្រោយល្បែងទាំងនោះ។"}
          </p>

          <a
            href="/games"
            style={{
              display: "inline-block",
              padding: "12px 20px",
              border: `1px solid ${colors.deepGreen}`,
              borderRadius: "999px",
              color: colors.deepGreen,
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {lang === "en" ? "Explore the Games →" : "ស្វែងរកល្បែង →"}
          </a>
        </div>

        <div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "12px",
          }}
        >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "3px",
            border: "1px solid #B89452",
            borderRadius: "999px",
            backgroundColor: "#F3EBDD",
          }}
        >
          <button
            onClick={() => {
              setLang("en");
              localStorage.setItem("lang", "en");
            }}
            style={{
              padding: "7px 13px",
              border: "none",
              borderRadius: "999px",
              backgroundColor: lang === "en" ? "#234F3D" : "transparent",
              color: lang === "en" ? "#F3EBDD" : "#234F3D",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            English
          </button>

          <button
            onClick={() => {
              setLang("km");
              localStorage.setItem("lang", "km");
            }}
            style={{
              padding: "7px 13px",
              border: "none",
              borderRadius: "999px",
              backgroundColor: lang === "km" ? "#234F3D" : "transparent",
              color: lang === "km" ? "#F3EBDD" : "#234F3D",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ខ្មែរ
          </button>
        </div>
        </div>
        <img
          src="/khmer-tradition.jpg"
          alt="Khmer traditional game"
          style={{
            width: "100%",
            aspectRatio: "4 / 3",
            objectFit: "cover",
            borderRadius: "16px",
            display: "block",
          }}
        />
      </div>
      </section>
      <div
             style={{
              marginTop: "24px",
              padding: "8px 0",
              color: colors.deepGreen,
              lineHeight: 1.5,
              textAlign: "center",
            }}
            >
            <p style={{ margin: "0 0 8px" }}>
              <strong>Curated by:</strong> {collection.curator}
            </p>

            <p style={{ margin: 0 }}>
              <strong>Source:</strong> {collection.source}
            </p>
            </div>
      <footer
        style={{
          marginTop: "24px",
          padding: "32px 0",
          borderTop: `1px solid ${colors.mutedGold}`,
          fontSize: "13px",
          color: colors.mutedGold,
          textAlign: "center",
        }}
      >
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>  
    </main>
  );
}
