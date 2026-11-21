
"use client";

import collection from "../collection.config.js";

import { useEffect, useRef, useState } from "react";
import { createClient } from "../lib/supabase/client.js";

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
};

export default function Home() {
  const [supabase] = useState(() => createClient());
  const [lang, setLang] = useState("en");
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isReviewer, setIsReviewer] = useState(false);

  const profileMenuRef = useRef(null);

  // Homepage carousel
  const [activePhoto, setActivePhoto] = useState(0);

  const homepagePhotos = [
    "/angkor-wat.jpg",
    "/khlaeng-jarb-kon-morn.jpg",
    "/champa-champey.jpg",
    "/Dan-Derm-Sloek-Chhoer.jpg",
    "/teanh-prot.jpg",
    "/chol-chhoung.jpg",
  ];

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

  // Show the Review link only if Supabase confirms reviewer permission.
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfileOpen(false);
  };

  const username = user?.user_metadata?.username || "User";

  const showPreviousPhoto = () => {
    setActivePhoto(
      (current) =>
        (current - 1 + homepagePhotos.length) % homepagePhotos.length
    );
  };

  const showNextPhoto = () => {
    setActivePhoto(
      (current) => (current + 1) % homepagePhotos.length
    );
  };

  return (
    <main style={styles.wrap}>
      <style>{`
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
          <a
            href="#home"
            style={{ ...navLink, fontWeight: 700 }}
            aria-current="page"
          >
            {lang === "en" ? "Home" : "ទំព័រដើម"}
          </a>

          <a href="/games" style={navLink}>
            {lang === "en" ? "Games" : "ល្បែងប្រពៃណីខ្មែរ"}
          </a>

          {user ? (
            <>
              <a href="/contribute" style={navLink}>
                {lang === "en" ? "Contribute" : "ចូលរួមចែករំលែក"}
              </a>

              <a href="/my-entries" style={navLink}>
                {lang === "en" ? "My Entries" : "ជាធាតុរបស់ខ្ញុំ"}
              </a>

              {isReviewer && (
                <a href="/review" style={navLink}>
                  {lang === "en" ? "Review" : "ពិនិត្យ"}
                </a>
              )}

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
                      {lang === "en" ? "Username" : "ឈ្មោះអ្នកប្រើ"}
                    </p>

                    <p
                      style={{
                        margin: "0 0 14px",
                        color: colors.deepGreen,
                        fontSize: "14px",
                      }}
                    >
                      {user.user_metadata?.username ||
                        (lang === "en" ? "Not set" : "មិនទាន់កំណត់")}
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

      <section
        id="home"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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

          <a href="/games" style={pillLink}>
            {lang === "en"
              ? "Explore the Games →"
              : "ស្វែងរកល្បែងប្រពៃណីខ្មែរ →"}
          </a>

          <a
            href={user ? "/contribute" : "/signup"}
            style={{ ...pillLink, marginLeft: "12px" }}
          >
            {lang === "en"
              ? "Join as a Contributor"
              : "ចូលរួមជាអ្នកចែករំលែក"}
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
                border: `1px solid ${colors.mutedGold}`,
                borderRadius: "999px",
                backgroundColor: colors.warmBeige,
              }}
            >
              <button
                onClick={() => {
                  setLang("en");
                  localStorage.setItem("lang", "en");
                }}
                style={languageButton(lang === "en")}
              >
                English
              </button>

              <button
                onClick={() => {
                  setLang("km");
                  localStorage.setItem("lang", "km");
                }}
                style={languageButton(lang === "km")}
              >
                ខ្មែរ
              </button>
            </div>
          </div>

          {/* Homepage photo carousel */}
          <div
            style={{
              position: "relative",
              width: "100%",
            }}
          >
            <img
              src={homepagePhotos[activePhoto]}
              alt="Khmer traditional game"
              style={{
                width: "100%",
                aspectRatio: "4 / 3",
                objectFit: "cover",
                borderRadius: "16px",
                display: "block",
                boxShadow: "0 8px 24px rgba(35, 79, 61, 0.18)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = "scale(1)";
              }}
            />

            <button
              type="button"
              onClick={showPreviousPhoto}
              aria-label="Previous photo"
              style={carouselArrow("left")}
            >
              ‹
            </button>

            <button
              type="button"
              onClick={showNextPhoto}
              aria-label="Next photo"
              style={carouselArrow("right")}
            >
              ›
            </button>
          </div>

          {/* Carousel pagination dots */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "9px",
              marginTop: "16px",
            }}
          >
            {homepagePhotos.map((photo, index) => (
              <button
                key={photo}
                type="button"
                onClick={() => setActivePhoto(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-current={activePhoto === index ? "true" : undefined}
                style={{
                  width: activePhoto === index ? "11px" : "9px",
                  height: activePhoto === index ? "11px" : "9px",
                  borderRadius: "50%",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  backgroundColor:
                    activePhoto === index
                      ? colors.deepGreen
                      : colors.mutedGold,
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </div>
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
          <strong>
            {lang === "en" ? "Curated by:" : "រៀបចំដោយ៖"}
          </strong>{" "}
          {collection.curator}
        </p>

        <p style={{ margin: 0 }}>
          <strong>
            {lang === "en" ? "Source:" : "ប្រភព៖"}
          </strong>{" "}
          {collection.source[lang]}
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
        {lang === "en"
          ? "Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall 2026. This archive is under construction all semester. Come back in December."
          : "បង្កើតឡើងក្នុងមុខវិជ្ជា ICT 340 — Vibe Coding នៅសាកលវិទ្យាល័យអាមេរិកាំងភ្នំពេញ ឆមាសនារដូវស្លឹកឈើជ្រុះ ឆ្នាំ ២០២៦។ បណ្ណសារនេះកំពុងស្ថិតក្នុងដំណាក់កាលសាងសង់ពេញមួយឆមាស។ សូមត្រឡប់មកមើលម្ដងទៀតនៅខែធ្នូ។"}
      </footer>
    </main>
  );
}

const navLink = {
  color: colors.deepGreen,
  textDecoration: "none",
  fontSize: "14px",
};

const pillLink = {
  display: "inline-block",
  padding: "12px 20px",
  border: `1px solid ${colors.deepGreen}`,
  borderRadius: "999px",
  color: colors.deepGreen,
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 600,
};

function languageButton(isActive) {
  return {
    padding: "7px 13px",
    border: "none",
    borderRadius: "999px",
    backgroundColor: isActive ? colors.deepGreen : "transparent",
    color: isActive ? colors.warmBeige : colors.deepGreen,
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function carouselArrow(position) {
  return {
    position: "absolute",
    top: "50%",
    [position]: "12px",
    transform: "translateY(-50%)",
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "1px solid rgba(243, 235, 221, 0.8)",
    backgroundColor: "rgba(243, 235, 221, 0.85)",
    color: colors.deepGreen,
    fontSize: "28px",
    lineHeight: 1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}
