const colors = {
  deepGreen: "#234F3D",
  warmBeige: "#F3EBDD",
  mutedGold: "#B89452",
};

const styles = {
  card: {
    backgroundColor: colors.warmBeige,
    border: `1px solid ${colors.mutedGold}`,
    borderRadius: 16,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
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
}) {
  const imageSrc = photoUrl || getLegacyPhoto(title.en);

  return (
    <article style={styles.card}>
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
            }}
          />
        ) : (
          "IMAGE"
        )}
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>
          {title[lang]}
        </h3>

        <p style={styles.description}>
          {description[lang]}
        </p>

        <a href={`/games/${index}`} style={styles.button}>
          {lang === "en" ? "View more →" : "មើលបន្ថែម →"}
        </a>
      </div>
    </article>
  );
}
