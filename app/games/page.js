
"use client";

import { useEffect, useRef, useState } from "react";

import EntryCard from "../../components/EntryCard";
import { createClient } from "../../lib/supabase/client.js";

const colors = {
  deepGreen: "#234F3D",
  warmBeige: "#F3EBDD",
  mutedGold: "#B89452",
};

export default function Games() {
  const [supabase] = useState(() => createClient());

  const [searchTerm, setSearchTerm] = useState("");
  const [lang, setLang] = useState("en");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isReviewer, setIsReviewer] = useState(false);

  const profileMenuRef = useRef(null);

  // Load the saved language.
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
  }, []);

  // Check the signed-in user and listen for login/logout changes.
  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data, error }) => {
      if (active) {
        setUser(error ? null : data.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setProfileOpen(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Show Review only if the user has reviewer permission.
  useEffect(() => {
    let cancelled = false;

    async function checkReviewer() {
      if (!user) {
        setIsReviewer(false);
        return;
      }

      const { data, error } = await supabase.rpc("is_reviewer");

      if (!cancelled) {
        setIsReviewer(!error && data === true);
      }
    }

    checkReviewer();

    return () => {
      cancelled = true;
    };
  }, [user, supabase]);

  // Close the profile menu when clicking outside or pressing Escape.
  useEffect(() => {
    if (!profileOpen) return;

    const handleOutsideClick = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileOpen]);

  // Log out the current user.
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfileOpen(false);
  };

  const username = user?.user_metadata?.username || "User";

  // Load published games from Supabase.
  useEffect(() => {
    async function loadEntries() {
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("status", "published");

      if (error) {
        console.error(
          "Error loading entries:",
          error.message,
          error.details,
          error.hint,
          error.code
        );
        setEntries([]);
      } else {
        const order = [
          "Veay K’aom",
          "Veay K'aom",
          "Khlaeng Jarb Kon Morn",
          "Champa Champey",
          "Dan Derm Sloek Chhoer",
          "Teanh Prot",
          "Chol Chhoung",
          "Rorm Donderm Kav Eey",
          "Lout Bav",
        ];

        const getOrderIndex = (title) => {
          const index = order.findIndex((name) =>
            title.toLowerCase().includes(name.toLowerCase())
          );

          return index === -1 ? 999 : index;
        };

        const sortedData = [...data].sort((a, b) => {
          return getOrderIndex(a.title_en) - getOrderIndex(b.title_en);
        });

        setEntries(
          sortedData.map((entry) => ({
            id: entry.id,
            title: {
              en: entry.title_en,
              km: entry.title_kh,
            },
            description: {
              en: entry.description_en,
              km: entry.description_kh,
            },
            howItIsPlayed: {
              en: entry.how_it_is_played_en,
              km: entry.how_it_is_played_kh,
            },
            rules: {
              en: entry.rules_en,
              km: entry.rules_kh,
            },
            contributor: {
              en: entry.contributor_en,
              km: entry.contributor_kh,
            },
            place: {
              en: entry.place_en,
              km: entry.place_kh,
            },
            photoUrl: entry.photo_url,
          }))
        );
      }

      setLoading(false);
    }

    loadEntries();
  }, [supabase]);

  // Search games in both English and Khmer.
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

        @media (max-width: 480px) {
          .site-header {
            position: relative;
          }

          .user-menu {
            position: static !important;
          }

          .profile-dropdown {
            position: absolute !important;
            top: 100% !important;
            left: 12px !important;
            right: 12px !important;
            width: auto !important;
            max-width: none !important;
            margin-top: 8px !important;
            box-sizing: border-box !important;
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
        {/* Navigation */}
        <nav
          className="site-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
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
            {lang === "en"
              ? "KHMER LIVING ARCHIVE"
              : "មរតកល្បែងប្រពៃណីខ្មែរ"}
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <a href="/" style={navLink}>
              {lang === "en" ? "Home" : "ទំព័រដើម"}
            </a>

            <a
              href="/games"
              style={{ ...navLink, fontWeight: 700 }}
              aria-current="page"
            >
              {lang === "en" ? "Games" : "ល្បែងប្រពៃណីខ្មែរ"}
            </a>

            {user ? (
              <>
                <a href="/contribute" style={navLink}>
                  {lang === "en"
                    ? "Contribute"
                    : "ចូលរួមចែករំលែក"}
                </a>

                <a href="/my-entries" style={navLink}>
                  {lang === "en"
                    ? "My Entries"
                    : "ជាធាតុរបស់ខ្ញុំ"}
                </a>

                {isReviewer && (
                  <a href="/review" style={navLink}>
                    {lang === "en" ? "Review" : "ពិនិត្យ"}
                  </a>
                )}

                {/* Profile dropdown */}
                <div
                  className="user-menu"
                  ref={profileMenuRef}
                  style={{ position: "relative" }}
                >
                  <button
                    type="button"
                    onClick={() => setProfileOpen(!profileOpen)}
                    aria-label="Open account details"
                    aria-expanded={profileOpen}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      border: "none",
                      background: "transparent",
                      color: colors.deepGreen,
                      cursor: "pointer",
                      fontFamily: "'Courier New', monospace",
                      fontSize: "14px",
                    }}
                  >
                    <span
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: colors.deepGreen,
                        color: colors.warmBeige,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        border: `2px solid ${colors.mutedGold}`,
                      }}
                    >
                      {username.charAt(0).toUpperCase()}
                    </span>

                    <span>{username}</span>
                    <span>{profileOpen ? "▲" : "▼"}</span>
                  </button>

                  {profileOpen && (
                    <div
                      className="profile-dropdown"
                      style={{
                        position: "absolute",
                        top: "48px",
                        right: 0,
                        width: "260px",
                        maxWidth: "calc(100vw - 48px)",
                        padding: "18px",
                        backgroundColor: colors.warmBeige,
                        border: `1px solid ${colors.mutedGold}`,
                        borderRadius: "12px",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                        zIndex: 10,
                        overflowWrap: "anywhere",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 16px",
                          fontSize: "16px",
                          fontWeight: 700,
                          color: colors.deepGreen,
                        }}
                      >
                        {lang === "en"
                          ? "Account Details"
                          : "ព័ត៌មានគណនី"}
                      </p>

                      <p
                        style={{
                          margin: "0 0 6px",
                          color: colors.mutedGold,
                          fontSize: "12px",
                        }}
                      >
                        {lang === "en"
                          ? "Username"
                          : "ឈ្មោះអ្នកប្រើ"}
                      </p>

                      <p
                        style={{
                          margin: "0 0 14px",
                          color: colors.deepGreen,
                          fontSize: "14px",
                        }}
                      >
                        {user.user_metadata?.username ||
                          (lang === "en"
                            ? "Not set"
                            : "មិនទាន់កំណត់")}
                      </p>

                      <p
                        style={{
                          margin: "0 0 6px",
                          color: colors.mutedGold,
                          fontSize: "12px",
                        }}
                      >
                        {lang === "en" ? "Email" : "អ៊ីមែល"}
                      </p>

                      <p
                        style={{
                          margin: "0 0 18px",
                          color: colors.deepGreen,
                          fontSize: "14px",
                        }}
                      >
                        {user.email}
                      </p>

                      <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                          width: "100%",
                          padding: "10px",
                          backgroundColor: colors.deepGreen,
                          color: colors.warmBeige,
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        {lang === "en" ? "Logout" : "ចាកចេញ"}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <a href="/login" style={navLink}>
                  {lang === "en" ? "Login" : "ចូលគណនី"}
                </a>

                <a href="/signup" style={navLink}>
                  {lang === "en" ? "Sign up" : "បង្កើតគណនី"}
                </a>
              </>
            )}
          </div>
        </nav>

        {/* Collection heading */}
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

          {/* Collection description */}
          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.7,
              margin: 0,
              maxWidth: "100%",
              textAlign: "left",
              textIndent: 0,
            }}
          >
            {lang === "en"
              ? "Explore traditional Khmer games, including how they were played, their rules, and the people and places connected to them."
              : "ស្វែងយល់អំពីល្បែងប្រពៃណីខ្មែរ រួមទាំងរបៀបលេង ច្បាប់ល្បែង និងមនុស្សនិងទីកន្លែងដែលពាក់ព័ន្ធនឹងល្បែងទាំងនេះ។"}
          </p>
        </section>

        {/* Search */}
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
                lang === "en"
                  ? "Search games..."
                  : "ស្វែងរកល្បែង..."
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

        {/* Number of games */}
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

        {/* Game results */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "64px 24px",
              color: colors.deepGreen,
            }}
          >
            <p style={{ fontSize: "18px" }}>
              {lang === "en"
                ? "Loading games..."
                : "កំពុងផ្ទុកល្បែង..."}
            </p>
          </div>
        ) : filteredEntries.length === 0 ? (
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
                  key={entry.id}
                  title={entry.title}
                  description={entry.description}
                  howItIsPlayed={entry.howItIsPlayed}
                  rules={entry.rules}
                  contributor={entry.contributor}
                  place={entry.place}
                  photoUrl={entry.photoUrl}
                  index={originalIndex}
                  lang={lang}
                  searchTerm={searchTerm}
                />
              );
            })}
          </div>
        )}

        {/* Footer */}
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
          {lang === "en"
            ? "Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall 2026. This archive is under construction all semester. Come back in December."
            : "បង្កើតឡើងក្នុងមុខវិជ្ជា ICT 340 — Vibe Coding នៅសាកលវិទ្យាល័យអាមេរិកាំងភ្នំពេញ ឆមាសសរទរដូវ ឆ្នាំ ២០២៦។ បណ្ណសារនេះកំពុងស្ថិតក្នុងដំណាក់កាលសាងសង់ពេញមួយឆមាស។ សូមត្រឡប់មកមើលម្ដងទៀតនៅខែធ្នូ។"}
        </footer>
      </main>
    </>
  );
}

// Navigation link styling.
const navLink = {
  color: colors.deepGreen,
  textDecoration: "none",
  fontSize: "14px",
};
