
"use client";

import { useState } from "react";

const colors = {
  deepGreen: "#234F3D",
  warmBeige: "#F3EBDD",
  mutedGold: "#B89452",
};

// Highlight the searched word.
function highlightText(text, searchTerm) {
  const value = String(text || "");

  let search = searchTerm.toLowerCase().trim().replace(/^"|"$/g, "");

  if (
    (search.startsWith('"') && search.endsWith('"')) ||
    (search.startsWith("'") && search.endsWith("'"))
  ) {
    search = search.slice(1, -1).trim();
  }

  if (!search) return value;

  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = value.split(new RegExp(`(${escapedSearch})`, "gi"));

  return parts.map((part, index) =>
    part.toLowerCase() === search ? (
      <mark
        key={index}
        style={{
          backgroundColor: "#E8D5A8",
          color: "#234F3D",
          padding: "1px 3px",
          borderRadius: "3px",
        }}
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function getLegacyPhoto(title) {
  const titleLower = title.toLowerCase();

  if (titleLower.includes("veay k’aom") || titleLower.includes("veay k'aom")) {
    return "/Hit-the-Earthen-Pot.jpg";
  }

  if (titleLower.includes("khlaeng jarb kon morn")) {
    return "/khlaeng-jarb-kon-morn.jpg";
  }

  if (titleLower.includes("champa champey")) {
    return "/champa-champey.jpg";
  }

  if (titleLower.includes("dan derm sloek chhoer")) {
    return "/Dan-Derm-Sloek-Chhoer.jpg";
  }

  if (titleLower.includes("teanh prot")) {
    return "/teanh-prot.jpg";
  }

  if (titleLower.includes("chol chhoung")) {
    return "/chol-chhoung.jpg";
  }

  if (titleLower.includes("rorm donderm kav eey")) {
    return "/Rorm-Donderm-Kav-Eey.jpg";
  }

  if (titleLower.includes("lout bav")) {
    return "/Lout-Bav.jpg";
  }

  return null;
}

export default function EntryCard({
  title,
  description,
  photoUrl,
  index,
  lang,
  searchTerm = "",
}) {
  const [isHovered, setIsHovered] = useState(false);

  const imageSrc = photoUrl || getLegacyPhoto(title.en);

  const styles = {
    card: {
      backgroundColor: colors.warmBeige,
      border: `1px solid ${colors.mutedGold}`,
      borderRadius: 16,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxShadow: isHovered
        ? "0 12px 28px rgba(35, 79, 61, 0.20)"
        : "0 3px 10px rgba(35, 79, 61, 0.09)",
      transform: isHovered ? "translateY(-5px)" : "translateY(0)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },

    image: {
      width: "100%",
      aspectRatio: "4 / 3",
      backgroundColor: colors.deepGreen,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: colors.warmBeige,
      fontFamily: "'Courier New', monospace",
      fontSize: 12,
      letterSpacing: 1,
      overflow: "hidden",
    },

    content: {
      padding: 20,
      display: "flex",
      flexDirection: "column",
      flex: 1,
    },

    title: {
      fontSize: 20,
      lineHeight: 1.3,
      color: colors.deepGreen,
      margin: "0 0 10px",
    },

    description: {
      fontSize: 14,
      lineHeight: 1.6,
      color: colors.deepGreen,
      margin: "0 0 20px",
    },

    button: {
      marginTop: "auto",
      alignSelf: "flex-start",
      padding: "9px 0",
      backgroundColor: "transparent",
      border: "none",
      color: colors.deepGreen,
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
    },
  };

  return (
    <article
      style={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.image}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title[lang]}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transform: isHovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.4s ease",
            }}
          />
        ) : (
          "IMAGE"
        )}
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>
          {highlightText(title[lang], searchTerm)}
        </h3>

        <p style={styles.description}>
          {highlightText(description[lang], searchTerm)}
        </p>

        <a
          href={`/games/${index}?search=${encodeURIComponent(searchTerm)}`}
          style={styles.button}
        >
          {lang === "en" ? "View more →" : "មើលបន្ថែម →"}
        </a>
      </div>
    </article>
  );
}
