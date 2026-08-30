import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "80px 24px",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#2EE6A8",
    fontSize: 14,
    letterSpacing: 1,
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    margin: "16px 0 12px",
    lineHeight: 1.1,
  },
  description: {
    fontSize: 18,
    color: "#97A1B3",
    lineHeight: 1.6,
    margin: 0,
  },
  card: {
    marginTop: 48,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    margin: 0,
  },
  cardValue: {
    fontSize: 16,
    margin: "6px 0 0",
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: "#2EE6A8",
    marginTop: 48,
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid #2E3644",
    fontSize: 13,
    color: "#5A6373",
  },
};

export default function Home() {
  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.description}>{collection.description}</p>

      <div style={styles.card}>
        <p style={styles.cardLabel}>CURATED BY</p>
        <p style={styles.cardValue}>{collection.curator}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>SOURCE</p>
        <p style={styles.cardValue}>{collection.source}</p>
      </div>

      <EntryCard
        title="Veay K’aom or Hit the Earthen Pot Game (ល្បែងវាយក្អម)"
        description={`Description: Veay K’aom is a traditional Khmer game in which a blindfolded player tries to hit and break an earthen pot hanging from a rope with a stick. It is commonly associated with Khmer New Year celebrations and community gatherings.
How it is played: An earthen pot is hung from a rope at a suitable height. The player is blindfolded and turned around three times before being given a stick. The player then tries to locate the hanging pot and hit it with the stick. The player continues trying until the pot is hit and broken or the allowed number of misses is reached.
Rules: The player must remain blindfolded while attempting to hit the pot. The player loses after three misses. Successfully hitting and breaking the pot means the player wins.`}
        contributor="Grandparents / older people"
        place="Pagoda grounds and village community spaces in Cambodia, especially during Khmer New Year."
      />
      <EntryCard
        title="Khlaeng Jarb Kon Morn (ល្បែងក្លែងចាប់កូនមាន់)"
        description={`Description: Khlaeng Jarb Kon Khlaeng is a traditional Khmer group game in which one player acts as the khlaeng and tries to catch the chicks while another player acts as the hen and protects them. Several players form a group of chicks behind the hen. The game encourages teamwork, movement, and quick reactions.
How it is played: One player becomes the hen, several players become the chicks, and another player becomes the khlaeng. The chicks form a line behind the hen and hold onto one another. The khlaeng tries to move around the group and catch the chicks, especially those at the back. The hen moves from side to side to protect the chicks and prevent the khlaeng from reaching them.
Rules: The chicks must stay together and hold onto one another. The hen must try to protect the chicks from the khlaeng. The khlaeng tries to catch a chick while the hen attempts to block or avoid the khlaeng. Players can change roles and begin another round after the game ends.`}
        contributor="Grandparents / older people"
        place="Village communities and open community spaces in Cambodia, especially during Khmer New Year and other traditional gatherings."
      />
      <p style={styles.count}>Entries in the archive: 2 (for now)</p>
      <footer style={styles.footer}>
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall
        2026. This archive is under construction all semester. Come back in
        December.
      </footer>
    </main>
  );
}
