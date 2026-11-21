
"use client";

import { useEffect, useState } from "react";

export default function ReviewPageHeader() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang === "km" ? "km" : "en");
  }, []);

  const t = (english, khmer) =>
    lang === "en" ? english : khmer;

  const link = {
    color: "#234F3D",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
  };

  return (
    <>
      <a href="/" style={link}>
        {t("← Home", "← ទំព័រដើម")}
      </a>

      <h1
        style={{
          fontSize: "28px",
          margin: "24px 0 12px",
          color: "#234F3D",
          fontWeight: 700,
        }}
      >
        {t("Review Submissions", "ពិនិត្យការដាក់ស្នើ")}
      </h1>

      <p style={{ margin: "0 0 20px", color: "#555", lineHeight: 1.6 }}>
        {t(
          "Review pending contributions before they appear in the public archive.",
          "ពិនិត្យការរួមចំណែកដែលកំពុងរង់ចាំ មុនពេលបង្ហាញវានៅក្នុងបណ្ណសារសាធារណៈ។"
        )}
      </p>
    </>
  );
}
