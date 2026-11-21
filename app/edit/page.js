
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "../../lib/supabase/client.js";

function EditPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const entryId = searchParams.get("id");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("en");

  const [formData, setFormData] = useState({
    title_en: "",
    title_kh: "",
    description_en: "",
    description_kh: "",
    how_it_is_played_en: "",
    how_it_is_played_kh: "",
    rules_en: "",
    rules_kh: "",
    contributor_en: "",
    contributor_kh: "",
    place_en: "",
    place_kh: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const t = (english, khmer) => (lang === "en" ? english : khmer);

  // Character limits for all fields
  const fieldLimits = {
    title_en: 120,
    title_kh: 120,
    description_en: 1000,
    description_kh: 1000,
    how_it_is_played_en: 3000,
    how_it_is_played_kh: 3000,
    rules_en: 3000,
    rules_kh: 3000,
    contributor_en: 100,
    contributor_kh: 100,
    place_en: 200,
    place_kh: 200,
  };

  const fieldLabels = {
    title_en: ["Title (English)", "ចំណងជើង (ភាសាអង់គ្លេស)"],
    title_kh: ["Title (Khmer)", "ចំណងជើង (ភាសាខ្មែរ)"],
    description_en: ["Description (English)", "ការពិពណ៌នា (ភាសាអង់គ្លេស)"],
    description_kh: ["Description (Khmer)", "ការពិពណ៌នា (ភាសាខ្មែរ)"],
    how_it_is_played_en: ["How It Is Played (English)", "របៀបលេង (ភាសាអង់គ្លេស)"],
    how_it_is_played_kh: ["How It Is Played (Khmer)", "របៀបលេង (ភាសាខ្មែរ)"],
    rules_en: ["Rules (English)", "ច្បាប់នៃការលេង (ភាសាអង់គ្លេស)"],
    rules_kh: ["Rules (Khmer)", "ច្បាប់នៃការលេង (ភាសាខ្មែរ)"],
    contributor_en: ["Contributor (English)", "អ្នកចូលរួមចែករំលែក (ភាសាអង់គ្លេស)"],
    contributor_kh: ["Contributor (Khmer)", "អ្នកចូលរួមចែករំលែក (ភាសាខ្មែរ)"],
    place_en: ["Place (English)", "ទីកន្លែង (ភាសាអង់គ្លេស)"],
    place_kh: ["Place (Khmer)", "ទីកន្លែង (ភាសាខ្មែរ)"],
  };

  const getLengthErrorMessage = (name) => {
    const limit = fieldLimits[name];
    const [englishLabel, khmerLabel] = fieldLabels[name];

    return t(
      `${englishLabel} must be 1-${limit} characters.`,
      `${khmerLabel} ត្រូវមានពី ១ ដល់ ${limit} តួអក្សរ។`
    );
  };

  const getLimitHint = (name) => {
    const limit = fieldLimits[name];

    return t(
      `Maximum ${limit} characters.`,
      `អតិបរមា ${limit} តួអក្សរ។`
    );
  };

  // Check character limits immediately while typing
  const updateLengthError = (name, value) => {
    const limit = fieldLimits[name];

    setErrors((prev) => {
      const updatedErrors = { ...prev };

      if (value.trim().length > limit) {
        updatedErrors[name] = getLengthErrorMessage(name);
      } else {
        delete updatedErrors[name];
      }

      return updatedErrors;
    });
  };

  // Show the original filename only for a newly selected photo.
  const displayedPhotoFileName = photoFile?.name || "";

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang === "km" ? "km" : "en");
  }, []);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(photoFile);
    setPhotoPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [photoFile]);

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      if (!entryId) {
        alert(t("Entry not found.", "រកមិនឃើញទិន្នន័យហ្គេមទេ។"));
        router.push("/games");
        return;
      }

      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("id", entryId)
        .single();

      if (error || !data) {
        console.error("Error loading entry for edit:", error);
        alert(
          t(
            "Unable to load this entry.",
            "មិនអាចបង្ហាញទិន្នន័យហ្គេមនេះបានទេ។"
          )
        );
        router.push("/games");
        return;
      }

      if (data.owner !== user.id) {
        alert(
          t(
            "You can only edit your own entries.",
            "អ្នកអាចកែសម្រួលតែទិន្នន័យហ្គេមរបស់អ្នកប៉ុណ្ណោះ។"
          )
        );
        router.push("/games");
        return;
      }

      setFormData({
        title_en: data.title_en || "",
        title_kh: data.title_kh || "",
        description_en: data.description_en || "",
        description_kh: data.description_kh || "",
        how_it_is_played_en: data.how_it_is_played_en || "",
        how_it_is_played_kh: data.how_it_is_played_kh || "",
        rules_en: data.rules_en || "",
        rules_kh: data.rules_kh || "",
        contributor_en: data.contributor_en || "",
        contributor_kh: data.contributor_kh || "",
        place_en: data.place_en || "",
        place_kh: data.place_kh || "",
      });

      setCurrentPhotoUrl(data.photo_url || "");
      setLoading(false);
    }

    loadData();
  }, [entryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    updateLengthError(name, value);
  };

  const handleTextareaChange = (e) => {
    const { name, value } = e.target;

    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    updateLengthError(name, value);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhotoFile(file);
      setErrors((prev) => ({
        ...prev,
        photo: "",
      }));
    }
  };

  const handleRevertPhoto = () => {
    setPhotoFile(null);

    const photoInput = document.getElementById("photo");

    if (photoInput) {
      photoInput.value = "";
    }

    setErrors((prev) => ({
      ...prev,
      photo: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(fieldLimits).forEach((name) => {
      const value = formData[name].trim();
      const limit = fieldLimits[name];

      if (!value || value.length > limit) {
        newErrors[name] = getLengthErrorMessage(name);
      }
    });

    if (!photoFile && !currentPhotoUrl) {
      newErrors.photo = t(
        "Photo is required.",
        "សូមបញ្ចូលរូបថត។"
      );
    }

    if (photoFile) {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!validTypes.includes(photoFile.type)) {
        newErrors.photo = t(
          "Only JPEG, PNG, and WebP files are allowed.",
          "អនុញ្ញាតតែឯកសាររូបភាពប្រភេទ JPEG, PNG និង WebP ប៉ុណ្ណោះ។"
        );
      }

      if (photoFile.size > 5 * 1024 * 1024) {
        newErrors.photo = t(
          "File size must be less than 5 MB.",
          "ទំហំឯកសារត្រូវតិចជាង ៥ MB។"
        );
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let photoUrl = currentPhotoUrl;

      if (photoFile) {
        const fileExtension = photoFile.name
          .split(".")
          .pop()
          .toLowerCase();

        const photoPath = `${user.id}/${crypto.randomUUID()}.${fileExtension}`;

        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(photoPath, photoFile);

        if (uploadError) {
          throw uploadError;
        }

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("photos")
          .getPublicUrl(photoPath);

        photoUrl = publicUrl;
      }



      const updatePayload = {
        title_en: formData.title_en.trim(),
        title_kh: formData.title_kh.trim(),
        description_en: formData.description_en.trim(),
        description_kh: formData.description_kh.trim(),
        how_it_is_played_en: formData.how_it_is_played_en.trim(),
        how_it_is_played_kh: formData.how_it_is_played_kh.trim(),
        rules_en: formData.rules_en.trim(),
        rules_kh: formData.rules_kh.trim(),
        contributor_en: formData.contributor_en.trim(),
        contributor_kh: formData.contributor_kh.trim(),
        place_en: formData.place_en.trim(),
        place_kh: formData.place_kh.trim(),
        photo_url: photoUrl,

        // Every owner edit sends the entry back for review.
        status: "pending",
      };



      const { data, error: updateError } = await supabase
        .from("entries")
        .update(updatePayload)
        .eq("id", entryId)
        .select();

      if (updateError) {
        throw updateError;
      }

      if (!data || data.length === 0) {
        console.error("Update returned no row.");
        alert(
          t(
            "That change wasn't saved.",
            "ការផ្លាស់ប្តូរនេះមិនត្រូវបានរក្សាទុកទេ។"
          )
        );
        return;
      }

      router.push("/games");
    } catch (error) {
      console.error(
        "Error updating entry:",
        error?.message,
        error?.details,
        error?.hint,
        error?.code
      );

      alert(
        t(
          "An error occurred. Please try again.",
          "មានបញ្ហាកើតឡើង។ សូមព្យាយាមម្តងទៀត។"
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p>{t("Loading...", "កំពុងដំណើរការ...")}</p>;
  }

  return (
    <>
      <style>{`
        .edit-form {
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
          padding: 24px;
          box-sizing: border-box;
          color: #234F3D;
          font-family: "Noto Sans Khmer", "Noto Sans", Arial, sans-serif;
        }

        .edit-form h1 {
          margin-bottom: 28px;
          line-height: 1.4;
        }

        .language-pair {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .form-field {
          margin-bottom: 20px;
        }

        .language-pair .form-field {
          margin-bottom: 0;
        }

        .form-field > label {
          display: block;
          margin-bottom: 7px;
          font-weight: 600;
          line-height: 1.6;
        }

        .edit-form input[type="text"],
        .edit-form textarea {
          width: 100%;
          box-sizing: border-box;
          font-family: "Noto Sans Khmer", "Noto Sans", Arial, sans-serif;
          font-size: 16px;
          line-height: 1.6;
          
          padding: 9px 12px;
          border: 1px solid #234F3D;
          border-radius: 6px;
          background: #F3EBDD;
          color: #234F3D;
        }

        .edit-form input[type="text"] {
          height: 44px;
        }

        .edit-form textarea {
          min-height: 60px;
          overflow: hidden;
          resize: none;
        }

        .field-hint {
          margin-top: 5px;
          color: #718075;
          font-size: 12px;
          line-height: 1.5;
        }

        .error {
          margin-top: 6px;
          color: #b00020;
          font-size: 14px;
          line-height: 1.5;
        }

        .submit-button {
          margin-top: 4px;
          padding: 11px 24px;
          border: none;
          border-radius: 6px;
          background: #234F3D;
          color: #F3EBDD;
          font-family: "Noto Sans Khmer", "Noto Sans", Arial, sans-serif;
          font-size: 16px;
          cursor: pointer;
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Photo upload area */
        .photo-upload-area {
          width: 100%;
          box-sizing: border-box;
          border: 1.5px dashed #B89452;
          border-radius: 12px;
          background: #F3EBDD;
          padding: 20px;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .photo-upload-area:hover {
          border-color: #234F3D;
          background: #eee7d7;
        }

        .photo-input {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .photo-upload-area:focus-within {
          outline: 2px solid #234F3D;
          outline-offset: 3px;
        }

        .photo-upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 8px;
          width: 100%;
          color: #234F3D;
        }

        .photo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #e5dfcf;
          color: #234F3D;
        }

        .photo-upload-content strong {
          font-size: 16px;
          font-weight: 600;
        }

        .photo-upload-content > span {
          font-size: 14px;
          line-height: 1.6;
        }

        .photo-preview {
          display: block;
          width: 100%;
          max-width: 280px;
          height: 180px;
          object-fit: contain;
          border-radius: 8px;
        }

        .photo-filename {
          display: block;
          width: 100%;
          max-width: 280px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #718075;
          font-size: 12px;
          line-height: 1.5;
        }

        .photo-action-text {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 6px;
          width: 100%;
          text-align: center;
          line-height: 1.6;
        }

        .photo-change-action {
          display: inline-block;
          color: #234F3D;
          font-size: 14px;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
          cursor: pointer;
          white-space: nowrap;
        }

        .photo-change-action:hover {
          color: #B89452;
        }

        .photo-helper {
          display: inline;
          color: #718075;
          font-size: 13px;
        }

        .photo-upload-content .photo-format {
          display: block;
          width: 100%;
          color: #718075;
          font-size: 12px;
          line-height: 1.5;
          margin-top: 2px;
        }

        .photo-revert-button {
          display: block;
          margin: 10px auto 0;
          padding: 5px 10px;
          border: none;
          background: transparent;
          color: #234F3D;
          font-family: inherit;
          font-size: 13px;
          text-decoration: underline;
          cursor: pointer;
        }

        .photo-revert-button:hover {
          color: #B89452;
        }

        @media (max-width: 600px) {
          .edit-form {
            padding: 16px;
          }

          .language-pair {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .language-pair .form-field {
            margin-bottom: 20px;
          }
        }
      `}</style>

      <form onSubmit={handleSubmit} className="edit-form">
        <button
          type="button"
          onClick={() => router.push("/my-entries")}
          style={{
            marginBottom: "20px",
            marginLeft: "0",
            padding: "0",
            backgroundColor: "transparent",
            color: "#234F3D",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {t(
            "← Cancel / Back to My Entries",
            "← បោះបង់ / ត្រឡប់ទៅទិន្នន័យហ្គេមរបស់ខ្ញុំ"
          )}
        </button>

        <h1 style={{ marginLeft: "0" }}>
          {t("Edit Game", "កែសម្រួលហ្គេម")}
        </h1>

        {/* Title */}
        <div className="language-pair">
          <div className="form-field">
            <label htmlFor="title_en">
              {t("Title (English):", "ចំណងជើង (ភាសាអង់គ្លេស):")}
            </label>
            <input
              id="title_en"
              type="text"
              name="title_en"
              value={formData.title_en}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <div className="field-hint">{getLimitHint("title_en")}</div>
            {errors.title_en && <div className="error">{errors.title_en}</div>}
          </div>

          <div className="form-field">
            <label htmlFor="title_kh">
              {t("Title (Khmer):", "ចំណងជើង (ភាសាខ្មែរ):")}
            </label>
            <input
              id="title_kh"
              type="text"
              name="title_kh"
              value={formData.title_kh}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <div className="field-hint">{getLimitHint("title_kh")}</div>
            {errors.title_kh && <div className="error">{errors.title_kh}</div>}
          </div>
        </div>

        {/* Description */}
        <div className="language-pair">
          <div className="form-field">
            <label htmlFor="description_en">
              {t("Description (English):", "ការពិពណ៌នា (ភាសាអង់គ្លេស):")}
            </label>
            <textarea
              id="description_en"
              name="description_en"
              value={formData.description_en}
              onChange={handleTextareaChange}
              disabled={isSubmitting}
            />
            <div className="field-hint">{getLimitHint("description_en")}</div>
            {errors.description_en && (
              <div className="error">{errors.description_en}</div>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="description_kh">
              {t("Description (Khmer):", "ការពិពណ៌នា (ភាសាខ្មែរ):")}
            </label>
            <textarea
              id="description_kh"
              name="description_kh"
              value={formData.description_kh}
              onChange={handleTextareaChange}
              disabled={isSubmitting}
            />
            <div className="field-hint">{getLimitHint("description_kh")}</div>
            {errors.description_kh && (
              <div className="error">{errors.description_kh}</div>
            )}
          </div>
        </div>

        {/* How It Is Played */}
        <div className="language-pair">
          <div className="form-field">
            <label htmlFor="how_it_is_played_en">
              {t("How It Is Played (English):", "របៀបលេង (ភាសាអង់គ្លេស):")}
            </label>
            <textarea
              id="how_it_is_played_en"
              name="how_it_is_played_en"
              value={formData.how_it_is_played_en}
              onChange={handleTextareaChange}
              disabled={isSubmitting}
            />
            <div className="field-hint">{getLimitHint("how_it_is_played_en")}</div>
            {errors.how_it_is_played_en && (
              <div className="error">{errors.how_it_is_played_en}</div>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="how_it_is_played_kh">
              {t("How It Is Played (Khmer):", "របៀបលេង (ភាសាខ្មែរ):")}
            </label>
            <textarea
              id="how_it_is_played_kh"
              name="how_it_is_played_kh"
              value={formData.how_it_is_played_kh}
              onChange={handleTextareaChange}
              disabled={isSubmitting}
            />
            <div className="field-hint">{getLimitHint("how_it_is_played_kh")}</div>
            {errors.how_it_is_played_kh && (
              <div className="error">{errors.how_it_is_played_kh}</div>
            )}
          </div>
        </div>

        {/* Rules */}
        <div className="language-pair">
          <div className="form-field">
            <label htmlFor="rules_en">
              {t("Rules (English):", "ច្បាប់នៃការលេង (ភាសាអង់គ្លេស):")}
            </label>
            <textarea
              id="rules_en"
              name="rules_en"
              value={formData.rules_en}
              onChange={handleTextareaChange}
              disabled={isSubmitting}
            />
            <div className="field-hint">{getLimitHint("rules_en")}</div>
            {errors.rules_en && <div className="error">{errors.rules_en}</div>}
          </div>

          <div className="form-field">
            <label htmlFor="rules_kh">
              {t("Rules (Khmer):", "ច្បាប់នៃការលេង (ភាសាខ្មែរ):")}
            </label>
            <textarea
              id="rules_kh"
              name="rules_kh"
              value={formData.rules_kh}
              onChange={handleTextareaChange}
              disabled={isSubmitting}
            />
            <div className="field-hint">{getLimitHint("rules_kh")}</div>
            {errors.rules_kh && <div className="error">{errors.rules_kh}</div>}
          </div>
        </div>

        {/* Contributor */}
        <div className="language-pair">
          <div className="form-field">
            <label htmlFor="contributor_en">
              {t("Contributor (English):", "អ្នកចូលរួមចែករំលែក (ភាសាអង់គ្លេស):")}
            </label>
            <input
              id="contributor_en"
              type="text"
              name="contributor_en"
              value={formData.contributor_en}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <div className="field-hint">{getLimitHint("contributor_en")}</div>
            {errors.contributor_en && (
              <div className="error">{errors.contributor_en}</div>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="contributor_kh">
              {t("Contributor (Khmer):", "អ្នកចូលរួមចែករំលែក (ភាសាខ្មែរ):")}
            </label>
            <input
              id="contributor_kh"
              type="text"
              name="contributor_kh"
              value={formData.contributor_kh}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <div className="field-hint">{getLimitHint("contributor_kh")}</div>
            {errors.contributor_kh && (
              <div className="error">{errors.contributor_kh}</div>
            )}
          </div>
        </div>

        {/* Place */}
        <div className="language-pair">
          <div className="form-field">
            <label htmlFor="place_en">
              {t("Place (English):", "ទីកន្លែង (ភាសាអង់គ្លេស):")}
            </label>
            <input
              id="place_en"
              type="text"
              name="place_en"
              value={formData.place_en}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <div className="field-hint">{getLimitHint("place_en")}</div>
            {errors.place_en && <div className="error">{errors.place_en}</div>}
          </div>

          <div className="form-field">
            <label htmlFor="place_kh">
              {t("Place (Khmer):", "ទីកន្លែង (ភាសាខ្មែរ):")}
            </label>
            <input
              id="place_kh"
              type="text"
              name="place_kh"
              value={formData.place_kh}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <div className="field-hint">{getLimitHint("place_kh")}</div>
            {errors.place_kh && <div className="error">{errors.place_kh}</div>}
          </div>
        </div>

        {/* Photo upload */}
        <div className="form-field">
          <label>
            {t("Photo:", "រូបថត:")}
          </label>

          <div className="photo-upload-area">
            <input
              id="photo"
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handlePhotoChange}
              disabled={isSubmitting}
              className="photo-input"
            />

            <div className="photo-upload-content">
              {(photoPreviewUrl || currentPhotoUrl) ? (
                <>
                  <img
                    src={photoPreviewUrl || currentPhotoUrl}
                    alt={t(
                      "Game photo preview",
                      "រូបភាពមើលជាមុនរបស់ហ្គេម"
                    )}
                    className="photo-preview"
                  />

                  {displayedPhotoFileName && (
                    <span
                      className="photo-filename"
                      title={displayedPhotoFileName}
                    >
                      {displayedPhotoFileName}
                    </span>
                  )}

                  <div className="photo-action-text">
                    <label
                      htmlFor="photo"
                      className="photo-change-action"
                    >
                      {t("Change photo", "ប្តូររូបថត")}
                    </label>

                    <span className="photo-helper">
                      {t(
                        "or Leave unchanged to keep the current photo",
                        "ឬកុំប្តូរ ដើម្បីរក្សារូបថតបច្ចុប្បន្ន"
                      )}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="photo-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="34"
                      height="34"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                  </div>

                  <strong>
                    {t("Upload a new photo", "បញ្ចូលរូបថតថ្មី")}
                  </strong>

                  <label
                    htmlFor="photo"
                    className="photo-change-action"
                  >
                    {t(
                      "Click here to choose an image from your device",
                      "ចុចទីនេះដើម្បីជ្រើសរើសរូបភាពពីឧបករណ៍របស់អ្នក"
                    )}
                  </label>
                </>
              )}

              <span className="photo-format">
                {t(
                  "JPG, PNG or WebP · Maximum 5 MB",
                  "JPG, PNG ឬ WebP · ទំហំអតិបរមា ៥ MB"
                )}
              </span>
            </div>
          </div>

          {photoFile && (
            <button
              type="button"
              className="photo-revert-button"
              onClick={handleRevertPhoto}
              disabled={isSubmitting}
            >
              {currentPhotoUrl
                ? t("Revert to current photo", "ត្រឡប់ទៅរូបថតបច្ចុប្បន្ន")
                : t("Remove selected photo", "លុបរូបថតដែលបានជ្រើសរើស")}
            </button>
          )}

          {errors.photo && <div className="error">{errors.photo}</div>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting
            ? t("Saving...", "កំពុងរក្សាទុក...")
            : t("Save Changes", "រក្សាទុកការផ្លាស់ប្តូរ")}
        </button>
      </form>
    </>
  );
}

export default function EditPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EditPageContent />
    </Suspense>
  );
}
