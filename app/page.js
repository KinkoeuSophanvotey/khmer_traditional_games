"use client";

import collection from "../collection.config.js";

import { useEffect, useState } from "react";
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
  const supabase = createClient();
  const [lang, setLang] = useState("en");
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setProfileOpen(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfileOpen(false);
  };

  const username = user?.user_metadata?.username || "User";

  return (
    <main style={styles.wrap}>
      <nav
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
          <a href="#home" style={navLink}>
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

              <div style={{ position: "relative" }}>
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
                      {lang === "en" ? "Account Details" : "ព័ត៌មានគណនី"}
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
                      {user.user_metadata?.username || "Not set"}
                    </p>

                    <p
                      style={{
                        margin: "0 0 6px",
                        color: colors.mutedGold,
                        fontSize: "12px",
                      }}
                    >
                      Email
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
            href="/signup"
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
