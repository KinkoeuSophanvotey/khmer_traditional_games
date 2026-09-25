"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client.js";

const colors = {
  deepGreen: "#234F3D",
  warmBeige: "#F3EBDD",
  mutedGold: "#B89452",
};

const styles = {
  wrap: {
    maxWidth: 440,
    margin: "0 auto",
    padding: "0 24px",
    backgroundColor: colors.warmBeige,
    minHeight: "100vh",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
    maxWidth: 360,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 18px",
    backgroundColor: colors.warmBeige,
    border: `1px solid ${colors.mutedGold}`,
    borderRadius: 8,
    color: colors.deepGreen,
    fontSize: "16px",
    fontFamily: "inherit",
  },
  button: {
    display: "inline-block",
    padding: "14px 32px",
    backgroundColor: colors.deepGreen,
    color: colors.warmBeige,
    border: "none",
    borderRadius: 8,
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Courier New', monospace",
    textAlign: "center",
    marginTop: "8px",
  },
  error: {
    color: "#C0392B",
    fontSize: "14px",
    fontFamily: "'Courier New', monospace",
    textAlign: "center",
    marginTop: "8px",
  },
  link: {
    color: colors.deepGreen,
    textDecoration: "none",
    fontSize: "14px",
    marginTop: "16px",
    textAlign: "center",
    fontFamily: "'Courier New', monospace",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: colors.deepGreen,
    marginBottom: "8px",
    fontFamily: "'Courier New', monospace",
  },
  subtitle: {
    fontSize: 14,
    color: colors.mutedGold,
    marginBottom: "32px",
    textAlign: "center",
    fontFamily: "'Courier New', monospace",
  },
  success: {
    color: colors.deepGreen,
    fontSize: "16px",
    fontFamily: "'Courier New', monospace",
    textAlign: "center",
    marginTop: "16px",
  },
};

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(
        lang === "en"
          ? "Invalid email or password"
          : "អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ"
      );
      return;
    }

    setSuccess(true);
  }

  return (
    <main style={styles.wrap}>
      <h1 style={styles.title}>
        {lang === "en" ? "Sign Up" : "ចុះឈ្មោះ"}
      </h1>
      <p style={styles.subtitle}>
        {lang === "en"
          ? "Create your archive account"
          : "បង្កើតគណនីបណ្ណសាររបស់អ្នក"}
      </p>
      {!success ? (
        <>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="email"
              placeholder={lang === "en" ? "Email" : "អ៊ីមែល"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="password"
              placeholder={lang === "en" ? "Password" : "ពាក្យសម្ងាត់"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={styles.button}>
              {lang === "en" ? "Sign Up" : "ចុះឈ្មោះ"}
            </button>
          </form>
          <a href="/login" style={styles.link}>
            {lang === "en"
              ? "Already have an account? Sign in"
              : "មានគណនីរួចហើយមែនទេ? ចូលគណនី"}
          </a>
        </>
      ) : (
        <p style={styles.success}>
          {lang === "en"
            ? "Account created! You can now sign in."
            : "បានបង្កើតគណនីរួចរាល់! ឥឡូវនេះអ្នកអាចចូលគណនីបាន។"}
        </p>
      )}
    </main>
  );
}
