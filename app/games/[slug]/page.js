"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/client.js";
import { useRouter } from "next/navigation";

function getLegacyPhoto(title) {
  const titleLower = title.toLowerCase();

  if (
    titleLower.includes("veay k’aom") ||
    titleLower.includes("veay k'aom")
  ) {
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

function getOrderIndex(title) {
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

  const index = order.findIndex((name) =>
    title.toLowerCase().includes(name.toLowerCase())
  );

  return index === -1 ? 999 : index;
}

export default function GameDetail({ params }) {
  const { slug } = use(params);
  const index = Number(slug);

  const supabase = createClient();
  const router = useRouter();

  const [lang, setLang] = useState("en");
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
  }, []);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserId(user?.id || null);
    }

    loadUser();
  }, []);

  useEffect(() => {
    async function loadEntry() {
      const { data, error } = await supabase
        .from("entries")
        .select("*");

      if (error) {
        console.error("Error loading entry:", error);
        setEntry(null);
      } else {
        const sortedData = [...data].sort((a, b) => {
          return getOrderIndex(a.title_en) - getOrderIndex(b.title_en);
        });

        if (sortedData[index]) {
          const item = sortedData[index];

          setEntry({
            id: item.id,
            owner: item.owner,
            title: {
              en: item.title_en,
              km: item.title_kh,
            },
            description: {
              en: item.description_en,
              km: item.description_kh,
            },
            howItIsPlayed: {
              en: item.how_it_is_played_en,
              km: item.how_it_is_played_kh,
            },
            rules: {
              en: item.rules_en,
              km: item.rules_kh,
            },
            contributor: {
              en: item.contributor_en,
              km: item.contributor_kh,
            },
            place: {
              en: item.place_en,
              km: item.place_kh,
            },
            photoUrl: item.photo_url,
          });
        } else {
          setEntry(null);
        }
      }

      setLoading(false);
    }

    loadEntry();
  }, [index]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this game?"
    );

    if (!confirmed) return;

    try {
      const { data, error } = await supabase
        .from("entries")
        .delete()
        .eq("id", entry.id)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        console.error("Delete returned no row.");
        alert("That change wasn't saved");
        return;
      }

      router.push("/games");
    } catch (error) {
      console.error(
        "Error deleting entry:",
        error?.message,
        error?.details,
        error?.hint,
        error?.code
      );
      alert("An error occurred. Please try again.");
    }
  };

  if (loading) {
    return (
      <p
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "60px 24px",
          color: "#234F3D",
        }}
      >
        {lang === "en" ? "Loading game..." : "កំពុងផ្ទុកល្បែង..."}
      </p>
    );
  }

  if (!entry) {
    return (
      <p
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "60px 24px",
          color: "#234F3D",
        }}
      >
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
          src={entry.photoUrl || getLegacyPhoto(entry.title.en)}
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

        {userId === entry.owner && (
          <div
            style={{
              marginTop: 32,
              display: "flex",
              gap: 12,
            }}
          >
            <a
              href={`/edit?id=${entry.id}`}
              style={{
                padding: "10px 18px",
                backgroundColor: "#234F3D",
                color: "#FFFFFF",
                textDecoration: "none",
                borderRadius: 8,
              }}
            >
              {lang === "en" ? "Edit" : "កែប្រែ"}
            </a>

            <button
              type="button"
              onClick={handleDelete}
              style={{
                padding: "10px 18px",
                backgroundColor: "#B94A48",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              {lang === "en" ? "Delete" : "លុប"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}