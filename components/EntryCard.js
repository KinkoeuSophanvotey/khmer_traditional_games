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

export default function EntryCard({
  title,
  description,
  index,
  lang,
}) {
  return (
    <article style={styles.card}>
      <div style={styles.image}>
        {index === 0 ? (
          <img
            src="/Veay-K’aom.jpg"
            alt="Veay K’aom or Hit the Earthen Pot Game"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
      ) : index === 1 ? (
        <img
          src="/khlaeng-jarb-kon-morn.jpg"
          alt="Khlaeng Jarb Kon Morn"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        ) : index === 2 ? (
          <img
            src="/champa-champey.jpg"
            alt="Champa Champey"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : index === 3 ? (
        <img
          src="/Dan-Derm-Sloek-Chhoer.jpg"
          alt="Leaf Grabbing or Dan Derm Sloek Chhoer"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        ) : index === 4 ? (
          <img
            src="/teanh-prot.jpg"
            alt="Teanh Prot or Tug of War"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : index === 5 ? (
          <img
            src="/chol-chhoung.jpg"
            alt="Chol Chhoung"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : index === 6 ? (
          <img
            src="/Rorm-Donderm-Kav-Eey.jpg"
            alt="Dancing to Seize the Chair or Rorm Donderm Kav Eey"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : index === 7 ? (
          <img
            src="/Lout-Bav.jpg"
            alt="Lout Bav or Jumping Bag Game"
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