"use client";

import { use, useEffect, useState } from "react";
import entries from "../../../data/entries.js";

export default function GameDetail({ params }) {
  const { slug } = use(params);
  const index = Number(slug);

  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
  }, []);

  const entry = entries[index];

  if (!entry) {
    return (
      <p>
        {lang === "en" ? "Game not found." : "រកមិនឃើញល្បែងទេ។"}
      </p>
    );
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "60px 24px",
        color: "#234F3D",
      }}
    >
      <a
        href="/games"
        style={{
          color: "#234F3D",
          textDecoration: "none",
          fontSize: 14,
        }}
      >
        {lang === "en" ? "← Back to Games" : "← ត្រឡប់ទៅល្បែង"}
      </a>

      <div
        style={{
          marginTop: 40,
          padding: 32,
          backgroundColor: "#F3EBDD",
          border: "1px solid #B89452",
          borderRadius: 16,
        }}
      >
        <img
          src={
            [
              "/Hit-the-Earthen-Pot.jpg",
              "/khlaeng-jarb-kon-morn.jpg",
              "/champa-champey.jpg",
              "/Dan-Derm-Sloek-Chhoer.jpg",
              "/Teanh-Prot.jpg",
              "/Chol-Chhoung.jpg",
              "/Rorm-Donderm-Kav-Eey.jpg",
              "/Lout-Bav.jpg",
            ][index]
          }
          alt={entry.title[lang]}
          style={{
            width: "100%",
            aspectRatio: "16 / 7",
            objectFit: "cover",
            borderRadius: 12,
            display: "block",
            marginBottom: 32,
          }}
        />

        <h1
          style={{
            margin: "0 0 16px",
            fontSize: 24,
            lineHeight: 1.2,
            fontWeight: 700,
          }}
        >
          {entry.title[lang]}
        </h1>

        <p>{entry.description[lang]}</p>

        <h2>
          {lang === "en" ? "How It Is Played" : "របៀបលេង"}
        </h2>
        <p>{entry.howItIsPlayed[lang]}</p>

        <h2>
          {lang === "en" ? "Rules" : "ច្បាប់ក្នុងការលេង"}
        </h2>
        <p>{entry.rules[lang]}</p>

        <h2>
          {lang === "en" ? "Contributor" : "អ្នកផ្តល់ព័ត៌មាន"}
        </h2>
        <p>{entry.contributor[lang]}</p>

        <h2>
          {lang === "en" ? "Place" : "ទីកន្លែង"}
        </h2>
        <p>{entry.place[lang]}</p>
      </div>
    </main>
  );
}
