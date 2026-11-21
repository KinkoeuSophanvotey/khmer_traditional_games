
"use client";

import { useState, useEffect } from "react";

import { createClient } from "../../lib/supabase/client.js";



export default function ContributePage() {
  const [user, setUser] = useState(null);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const supabase = createClient();

  // Character limits for all text fields.
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

  // Generate the character-limit error in the selected language.
  const getLengthErrorMessage = (name) => {
    const labels = {
      title_en: ["Title (English)", "ចំណងជើងភាសាអង់គ្លេស"],
      title_kh: ["Title (Khmer)", "ចំណងជើងភាសាខ្មែរ"],
      description_en: ["Description (English)", "ការពិពណ៌នាភាសាអង់គ្លេស"],
      description_kh: ["Description (Khmer)", "ការពិពណ៌នាភាសាខ្មែរ"],
      how_it_is_played_en: [
        "How It Is Played (English)",
        "របៀបលេងជាភាសាអង់គ្លេស",
      ],
      how_it_is_played_kh: [
        "How It Is Played (Khmer)",
        "របៀបលេងជាភាសាខ្មែរ",
      ],
      rules_en: ["Rules (English)", "ច្បាប់នៃការលេងជាភាសាអង់គ្លេស"],
      rules_kh: ["Rules (Khmer)", "ច្បាប់នៃការលេងជាភាសាខ្មែរ"],
      contributor_en: [
        "Contributor (English)",
        "ឈ្មោះអ្នកផ្តល់ព័ត៌មានជាភាសាអង់គ្លេស",
      ],
      contributor_kh: [
        "Contributor (Khmer)",
        "ឈ្មោះអ្នកផ្តល់ព័ត៌មានជាភាសាខ្មែរ",
      ],
      place_en: ["Place (English)", "ទីកន្លែងជាភាសាអង់គ្លេស"],
      place_kh: ["Place (Khmer)", "ទីកន្លែងជាភាសាខ្មែរ"],
    };

    const label = labels[name][lang === "en" ? 0 : 1];
    const limit = fieldLimits[name];

    return lang === "en"
      ? `${label} must be 1-${limit} characters.`
      : `${label} ត្រូវមានពី ១ ដល់ ${limit} តួអក្សរ។`;
  };

  // Show the maximum character limit under each field.
  const getLimitHint = (name) => {
    const limit = fieldLimits[name];

    return lang === "en"
      ? `Maximum ${limit} characters.`
      : `អតិបរមា ${limit} តួអក្សរ។`;
  };

  // Check the maximum character limit while the user is typing.
  const updateLengthError = (name, value) => {
    const limit = fieldLimits[name];

    if (!limit) return;

    const trimmedValue = value.trim();

    setErrors((previous) => {
      if (trimmedValue.length > limit) {
        return {
          ...previous,
          [name]: getLengthErrorMessage(name),
        };
      }

      // Remove the error when the user corrects the text.
      if (previous[name]) {
        const updatedErrors = { ...previous };
        delete updatedErrors[name];
        return updatedErrors;
      }

      return previous;
    });
  };

  // Load the saved language.
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang === "km" ? "km" : "en");
  }, []);

  // Create and clean up the selected photo preview URL.
  useEffect(() => {
    if (!photoFile) {
      setPhotoPreviewUrl("");
      return;
    }

    const previewUrl = URL.createObjectURL(photoFile);
    setPhotoPreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [photoFile]);

  // Check whether the user is logged in.
  useEffect(() => {
    let active = true;

    async function checkUser() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (!active) return;

        if (error) {
          console.error("Error checking user:", error.message);
          setUser(null);
        } else {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Login check failed:", error);
        if (active) setUser(null);
      } finally {
        if (active) setIsCheckingUser(false);
      }
    }

    checkUser();

    return () => {
      active = false;
    };
  }, []);

  // Handle text input changes.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    updateLengthError(name, value);
  };

  // Handle photo selection.
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0] || null;

    setPhotoFile(file);

    setErrors((previous) => ({
      ...previous,
      photo: "",
    }));
  };

  // Handle textarea changes and automatic height adjustment.
  const handleTextareaChange = (e) => {
    const { name, value } = e.target;

    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    updateLengthError(name, value);
  };

  // Validate all form fields before submission.
  const validateForm = () => {
    const newErrors = {};
    const isKhmer = lang === "km";

    const {
      title_en,
      title_kh,
      description_en,
      description_kh,
      how_it_is_played_en,
      how_it_is_played_kh,
      rules_en,
      rules_kh,
      contributor_en,
      contributor_kh,
      place_en,
      place_kh,
    } = formData;

    const titleEn = title_en.trim();
    const titleKh = title_kh.trim();
    const descriptionEn = description_en.trim();
    const descriptionKh = description_kh.trim();
    const howItIsPlayedEn = how_it_is_played_en.trim();
    const howItIsPlayedKh = how_it_is_played_kh.trim();
    const rulesEn = rules_en.trim();
    const rulesKh = rules_kh.trim();
    const contributorEn = contributor_en.trim();
    const contributorKh = contributor_kh.trim();
    const placeEn = place_en.trim();
    const placeKh = place_kh.trim();

    if (!titleEn || titleEn.length > 120) {
      newErrors.title_en = isKhmer
        ? "ចំណងជើងភាសាអង់គ្លេសត្រូវមានពី ១ ដល់ ១២០ តួអក្សរ។"
        : "Title (English) must be 1-120 characters.";
    }

    if (!titleKh || titleKh.length > 120) {
      newErrors.title_kh = isKhmer
        ? "ចំណងជើងភាសាខ្មែរត្រូវមានពី ១ ដល់ ១២០ តួអក្សរ។"
        : "Title (Khmer) must be 1-120 characters.";
    }

    if (!descriptionEn || descriptionEn.length > 1000) {
      newErrors.description_en = isKhmer
        ? "ការពិពណ៌នាភាសាអង់គ្លេសត្រូវមានពី ១ ដល់ ១០០០ តួអក្សរ។"
        : "Description (English) must be 1-1000 characters.";
    }

    if (!descriptionKh || descriptionKh.length > 1000) {
      newErrors.description_kh = isKhmer
        ? "ការពិពណ៌នាភាសាខ្មែរត្រូវមានពី ១ ដល់ ១០០០ តួអក្សរ។"
        : "Description (Khmer) must be 1-1000 characters.";
    }

    if (!howItIsPlayedEn || howItIsPlayedEn.length > 3000) {
      newErrors.how_it_is_played_en = isKhmer
        ? "របៀបលេងជាភាសាអង់គ្លេសត្រូវមានពី ១ ដល់ ៣០០០ តួអក្សរ។"
        : "How It Is Played (English) must be 1-3000 characters.";
    }

    if (!howItIsPlayedKh || howItIsPlayedKh.length > 3000) {
      newErrors.how_it_is_played_kh = isKhmer
        ? "របៀបលេងជាភាសាខ្មែរត្រូវមានពី ១ ដល់ ៣០០០ តួអក្សរ។"
        : "How It Is Played (Khmer) must be 1-3000 characters.";
    }

    if (!rulesEn || rulesEn.length > 3000) {
      newErrors.rules_en = isKhmer
        ? "ច្បាប់នៃការលេងជាភាសាអង់គ្លេសត្រូវមានពី ១ ដល់ ៣០០០ តួអក្សរ។"
        : "Rules (English) must be 1-3000 characters.";
    }

    if (!rulesKh || rulesKh.length > 3000) {
      newErrors.rules_kh = isKhmer
        ? "ច្បាប់នៃការលេងជាភាសាខ្មែរត្រូវមានពី ១ ដល់ ៣០០០ តួអក្សរ។"
        : "Rules (Khmer) must be 1-3000 characters.";
    }

    if (!contributorEn || contributorEn.length > 100) {
      newErrors.contributor_en = isKhmer
        ? "ឈ្មោះអ្នកផ្តល់ព័ត៌មានជាភាសាអង់គ្លេសត្រូវមានពី ១ ដល់ ១០០ តួអក្សរ។"
        : "Contributor (English) must be 1-100 characters.";
    }

    if (!contributorKh || contributorKh.length > 100) {
      newErrors.contributor_kh = isKhmer
        ? "ឈ្មោះអ្នកផ្តល់ព័ត៌មានជាភាសាខ្មែរត្រូវមានពី ១ ដល់ ១០០ តួអក្សរ។"
        : "Contributor (Khmer) must be 1-100 characters.";
    }

    if (!placeEn || placeEn.length > 200) {
      newErrors.place_en = isKhmer
        ? "ទីកន្លែងជាភាសាអង់គ្លេសត្រូវមានពី ១ ដល់ ២០០ តួអក្សរ។"
        : "Place (English) must be 1-200 characters.";
    }

    if (!placeKh || placeKh.length > 200) {
      newErrors.place_kh = isKhmer
        ? "ទីកន្លែងជាភាសាខ្មែរត្រូវមានពី ១ ដល់ ២០០ តួអក្សរ។"
        : "Place (Khmer) must be 1-200 characters.";
    }

    if (!photoFile) {
      newErrors.photo = isKhmer
        ? "សូមបញ្ចូលរូបថត។"
        : "Photo is required.";
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!validTypes.includes(photoFile.type)) {
        newErrors.photo = isKhmer
          ? "អនុញ្ញាតតែឯកសារ JPEG, PNG និង WebP ប៉ុណ្ណោះ។"
          : "Only JPEG, PNG, and WebP files are allowed.";
      }

      if (photoFile.size > 5 * 1024 * 1024) {
        newErrors.photo = isKhmer
          ? "ទំហំឯកសារត្រូវតិចជាង ៥ MB។"
          : "File size must be less than 5 MB.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit the form.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert(
        lang === "en"
          ? "Please log in before submitting an entry."
          : "សូមចូលគណនីជាមុនសិន មុនពេលដាក់ស្នើព័ត៌មាន។"
      );
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const fileExtension = photoFile.name.split(".").pop().toLowerCase();
      const photoPath = `${user.id}/${crypto.randomUUID()}.${fileExtension}`;


      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(photoPath, photoFile);

      if (uploadError) throw uploadError;

      

      const {
        data: { publicUrl },
      } = supabase.storage.from("photos").getPublicUrl(photoPath);

      const { error: insertError } = await supabase.from("entries").insert({
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
        owner: user.id,
        photo_url: publicUrl,
      });

      if (insertError) throw insertError;

      setFormData({
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

      setPhotoFile(null);
      setErrors({});

      const photoInput = document.getElementById("photo");
      if (photoInput) photoInput.value = "";

      setIsSuccess(true);
    } catch (error) {
      console.error(
        "Error submitting form:",
        error?.message,
        error?.details,
        error?.hint,
        error?.code
      );

      alert(
        lang === "en"
          ? "An error occurred while submitting your entry. Please check your connection and try again."
          : "មានបញ្ហាកើតឡើងក្នុងពេលដាក់ស្នើព័ត៌មានរបស់អ្នក។ សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិត ហើយព្យាយាមម្តងទៀត។"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingUser) {
    return (
      <p style={{ padding: 24, color: "#234F3D" }}>
        {lang === "en"
          ? "Checking your login..."
          : "កំពុងពិនិត្យការចូលគណនីរបស់អ្នក..."}
      </p>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: 24, color: "#234F3D" }}>
        <p>
          {lang === "en"
            ? "You must be logged in to contribute."
            : "អ្នកត្រូវចូលគណនីជាមុនសិន ដើម្បីចូលរួមចែករំលែក។"}
        </p>
        <a href="/login">
          {lang === "en" ? "Log in" : "ចូលគណនី"}
        </a>
        {" | "}
        <a href="/">
          {lang === "en" ? "← Home" : "← ទំព័រដើម"}
        </a>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="success-page">
        <h1>
          {lang === "en"
            ? "Thank You for Contributing!"
            : "សូមអរគុណចំពោះការចូលរួមចែករំលែក!"}
        </h1>

        <p>
          {lang === "en"
            ? "Your entry has been submitted successfully and is waiting for review."
            : "ព័ត៌មានរបស់អ្នកត្រូវបានដាក់ស្នើដោយជោគជ័យ ហើយកំពុងរង់ចាំការពិនិត្យ។"}
        </p>

        <p>
          {lang === "en"
            ? "You can check its status on My Entries."
            : "អ្នកអាចពិនិត្យស្ថានភាពរបស់វានៅក្នុងផ្នែក ធាតុដែលខ្ញុំបានដាក់ស្នើ។"}
        </p>

        <div className="success-actions">
          <a href="/">
            {lang === "en" ? "Go to Home" : "ទៅកាន់ទំព័រដើម"}
          </a>
          <a href="/my-entries">
            {lang === "en"
              ? "View My Entries"
              : "មើលធាតុដែលខ្ញុំបានដាក់ស្នើ"}
          </a>
        </div>

        <style>{`
          .success-page {
            max-width: 700px;
            margin: 60px auto;
            padding: 24px;
            color: #234F3D;
            text-align: center;
            font-family: "Noto Sans Khmer", "Noto Sans", Arial, sans-serif;
          }

          .success-actions {
            display: flex;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 28px;
          }

          .success-actions a {
            background: #234F3D;
            color: #F3EBDD;
            padding: 12px 20px;
            border-radius: 6px;
            text-decoration: none;
          }

          .success-actions a:last-child {
            background: #B89452;
            color: #FFFFFF;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .contribute-form {
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
          padding: 24px;
          box-sizing: border-box;
          color: #234F3D;
          font-family: "Noto Sans Khmer", "Noto Sans", Arial, sans-serif;
        }

        .contribute-form h1 {
          margin-bottom: 28px;
          line-height: 1.4;
        }

        .home-link {
          display: inline-block;
          margin-bottom: 20px;
          color: #234F3D;
          text-decoration: none;
          font-weight: 600;
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

        .form-field label {
          display: block;
          margin-bottom: 7px;
          font-weight: 600;
          line-height: 1.6;
        }

        .contribute-form input[type="text"],
        .contribute-form textarea {
          width: 100%;
          box-sizing: border-box;
          font-family: "Noto Sans Khmer", "Noto Sans", Arial, sans-serif;
          font-size: 16px;
          line-height: 1.6;
        }

        .contribute-form input[type="text"],
        .contribute-form textarea {
          padding: 9px 12px;
          border: 1px solid #234F3D;
          border-radius: 6px;
          background: #F3EBDD;
          color: #234F3D;
        }

        .contribute-form input[type="text"] {
          height: 44px;
        }

        .contribute-form textarea {
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

        /* Photo upload area */
        .photo-upload-area {
          position: relative;
          display: block;
          border: 1.5px dashed #B89452;
          border-radius: 12px;
          background: #F3EBDD;
          padding: 30px 20px;
          cursor: pointer;
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
          text-align: center;
          gap: 10px;
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
          overflow-wrap: anywhere;
        }

        .photo-upload-content span {
          font-size: 14px;
          line-height: 1.6;
        }

        .photo-upload-content .photo-format {
          color: #718075;
          font-size: 12px;
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

        @media (max-width: 600px) {
          .contribute-form {
            padding: 16px;
          }

          .language-pair {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .language-pair .form-field {
            margin-bottom: 20px;
          }

          .photo-upload-area {
            padding: 24px 14px;
          }
        }
      `}</style>

      <form onSubmit={handleSubmit} className="contribute-form">
        <a href="/" className="home-link">
          {lang === "en" ? "← Home" : "← ទំព័រដើម"}
        </a>

        <h1>
          {lang === "en"
            ? "Contribute a Game"
            : "ចូលរួមបន្ថែមល្បែងប្រពៃណីខ្មែរ"}
        </h1>

        {/* Title fields */}
        <div className="language-pair">
          <div className="form-field">
            <label htmlFor="title_en">
              {lang === "en"
                ? "Title (English):"
                : "ចំណងជើង (ភាសាអង់គ្លេស):"}
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
              {lang === "en"
                ? "Title (Khmer):"
                : "ចំណងជើង (ភាសាខ្មែរ):"}
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

        {/* Description fields */}
        <div className="language-pair">
          <div className="form-field">
            <label htmlFor="description_en">
              {lang === "en"
                ? "Description (English):"
                : "ការពិពណ៌នា (ភាសាអង់គ្លេស):"}
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
              {lang === "en"
                ? "Description (Khmer):"
                : "ការពិពណ៌នា (ភាសាខ្មែរ):"}
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

        {/* How It Is Played fields */}
        <div className="language-pair">
          <div className="form-field">
            <label htmlFor="how_it_is_played_en">
              {lang === "en"
                ? "How It Is Played (English):"
                : "របៀបលេង (ភាសាអង់គ្លេស):"}
            </label>

            <textarea
              id="how_it_is_played_en"
              name="how_it_is_played_en"
              value={formData.how_it_is_played_en}
              onChange={handleTextareaChange}
              disabled={isSubmitting}
            />
            <div className="field-hint">
              {getLimitHint("how_it_is_played_en")}
            </div>
            {errors.how_it_is_played_en && (
              <div className="error">{errors.how_it_is_played_en}</div>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="how_it_is_played_kh">
              {lang === "en"
                ? "How It Is Played (Khmer):"
                : "របៀបលេង (ភាសាខ្មែរ):"}
            </label>

            <textarea
              id="how_it_is_played_kh"
              name="how_it_is_played_kh"
              value={formData.how_it_is_played_kh}
              onChange={handleTextareaChange}
              disabled={isSubmitting}
            />
            <div className="field-hint">
              {getLimitHint("how_it_is_played_kh")}
            </div>
            {errors.how_it_is_played_kh && (
              <div className="error">{errors.how_it_is_played_kh}</div>
            )}
          </div>
        </div>

        {/* Rules fields */}
        <div className="language-pair">
          <div className="form-field">
            <label htmlFor="rules_en">
              {lang === "en"
                ? "Rules (English):"
                : "ច្បាប់នៃការលេង (ភាសាអង់គ្លេស):"}
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
              {lang === "en"
                ? "Rules (Khmer):"
                : "ច្បាប់នៃការលេង (ភាសាខ្មែរ):"}
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

        {/* Contributor fields */}
        <div className="language-pair">
          <div className="form-field">
            <label htmlFor="contributor_en">
              {lang === "en"
                ? "Contributor (English):"
                : "អ្នកចូលរួមផ្តល់ព័ត៌មាន (ភាសាអង់គ្លេស):"}
            </label>
            <input
              id="contributor_en"
              type="text"
              name="contributor_en"
              value={formData.contributor_en}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <div className="field-hint">
              {getLimitHint("contributor_en")}
            </div>
            {errors.contributor_en && (
              <div className="error">{errors.contributor_en}</div>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="contributor_kh">
              {lang === "en"
                ? "Contributor (Khmer):"
                : "អ្នកចូលរួមផ្តល់ព័ត៌មាន (ភាសាខ្មែរ):"}
            </label>
            <input
              id="contributor_kh"
              type="text"
              name="contributor_kh"
              value={formData.contributor_kh}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <div className="field-hint">
              {getLimitHint("contributor_kh")}
            </div>
            {errors.contributor_kh && (
              <div className="error">{errors.contributor_kh}</div>
            )}
          </div>
        </div>

        {/* Place fields */}
        <div className="language-pair">
          <div className="form-field">
            <label htmlFor="place_en">
              {lang === "en"
                ? "Place (English):"
                : "ទីកន្លែង (ភាសាអង់គ្លេស):"}
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
              {lang === "en"
                ? "Place (Khmer):"
                : "ទីកន្លែង (ភាសាខ្មែរ):"}
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
          <label className="photo-label">
            {lang === "en" ? "Photo:" : "រូបថត:"}
          </label>

          <label htmlFor="photo" className="photo-upload-area">
            <input
              id="photo"
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handlePhotoChange}
              disabled={isSubmitting}
              className="photo-input"
            />

            <div className="photo-upload-content">
              {photoFile ? (
                <>
                  {photoPreviewUrl && (
                    <img
                      src={photoPreviewUrl}
                      alt={
                        lang === "en"
                          ? "Selected photo"
                          : "រូបថតដែលបានជ្រើសរើស"
                      }
                      style={{
                        width: "100%",
                        maxWidth: "280px",
                        maxHeight: "180px",
                        objectFit: "contain",
                        borderRadius: "8px",
                      }}
                    />
                  )}

                  <span style={{ fontWeight: 600, fontSize: "13px" }}>
                    {photoFile.name}
                  </span>

                  <span>
                    {lang === "en"
                      ? "Click here to change image"
                      : "ចុចទីនេះដើម្បីប្តូររូបភាព"}
                  </span>
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
                    {lang === "en" ? "Upload a photo" : "បញ្ចូលរូបថត"}
                  </strong>

                  <span>
                    {lang === "en"
                      ? "Click here to choose an image from your device"
                      : "ចុចទីនេះដើម្បីជ្រើសរើសរូបភាពពីឧបករណ៍របស់អ្នក"}
                  </span>
                </>
              )}

              <span className="photo-format">
                {lang === "en"
                  ? "JPG, PNG or WebP · Maximum 5 MB"
                  : "JPG, PNG ឬ WebP · ទំហំអតិបរមា ៥ MB"}
              </span>
            </div>
          </label>

          {errors.photo && <div className="error">{errors.photo}</div>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting
            ? lang === "en"
              ? "Submitting..."
              : "កំពុងដាក់ស្នើ..."
            : lang === "en"
              ? "Submit"
              : "ដាក់ស្នើ"}
        </button>
      </form>
    </>
  );
}
