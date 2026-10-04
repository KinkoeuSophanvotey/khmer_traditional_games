"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client.js";

export default function ContributePage() {
  const [user, setUser] = useState(null);
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhotoFile(file);
    }
  };

  const handleTextareaChange = (e) => {
    const { name, value } = e.target;

    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

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
      newErrors.title_en =
        "Title (English) must be 1-120 characters.";
    }

    if (!titleKh || titleKh.length > 120) {
      newErrors.title_kh =
        "Title (Khmer) must be 1-120 characters.";
    }

    if (!descriptionEn || descriptionEn.length > 1000) {
      newErrors.description_en =
        "Description (English) must be 1-1000 characters.";
    }

    if (!descriptionKh || descriptionKh.length > 1000) {
      newErrors.description_kh =
        "Description (Khmer) must be 1-1000 characters.";
    }

    if (!howItIsPlayedEn || howItIsPlayedEn.length > 3000) {
      newErrors.how_it_is_played_en =
        "How It Is Played (English) must be 1-3000 characters.";
    }

    if (!howItIsPlayedKh || howItIsPlayedKh.length > 3000) {
      newErrors.how_it_is_played_kh =
        "How It Is Played (Khmer) must be 1-3000 characters.";
    }

    if (!rulesEn || rulesEn.length > 3000) {
      newErrors.rules_en =
        "Rules (English) must be 1-3000 characters.";
    }

    if (!rulesKh || rulesKh.length > 3000) {
      newErrors.rules_kh =
        "Rules (Khmer) must be 1-3000 characters.";
    }

    if (!contributorEn || contributorEn.length > 100) {
      newErrors.contributor_en =
        "Contributor (English) must be 1-100 characters.";
    }

    if (!contributorKh || contributorKh.length > 100) {
      newErrors.contributor_kh =
        "Contributor (Khmer) must be 1-100 characters.";
    }

    if (!placeEn || placeEn.length > 200) {
      newErrors.place_en =
        "Place (English) must be 1-200 characters.";
    }

    if (!placeKh || placeKh.length > 200) {
      newErrors.place_kh =
        "Place (Khmer) must be 1-200 characters.";
    }

    if (!photoFile) {
      newErrors.photo = "Photo is required.";
    } else {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!validTypes.includes(photoFile.type)) {
        newErrors.photo =
          "Only JPEG, PNG, and WebP files are allowed.";
      }

      if (photoFile.size > 5 * 1024 * 1024) {
        newErrors.photo =
          "File size must be less than 5 MB.";
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
      // Upload photo
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

      // Get photo URL
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("photos")
        .getPublicUrl(photoPath);

      // Insert entry
      const { data, error: insertError } = await supabase
        .from("entries")
        .insert({
          title_en: formData.title_en.trim(),
          title_kh: formData.title_kh.trim(),
          description_en: formData.description_en.trim(),
          description_kh: formData.description_kh.trim(),
          how_it_is_played_en:
            formData.how_it_is_played_en.trim(),
          how_it_is_played_kh:
            formData.how_it_is_played_kh.trim(),
          rules_en: formData.rules_en.trim(),
          rules_kh: formData.rules_kh.trim(),
          contributor_en: formData.contributor_en.trim(),
          contributor_kh: formData.contributor_kh.trim(),
          place_en: formData.place_en.trim(),
          place_kh: formData.place_kh.trim(),
          owner: user.id,
          photo_url: publicUrl,
        })
        .select("id")
        .single();

      if (insertError) {
        throw insertError;
      }

      const { id } = data;

      // Find the new entry's index
      const {
        data: entries,
        error: fetchError,
      } = await supabase
        .from("entries")
        .select("id")
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const entryIndex = entries.findIndex(
        (entry) => entry.id === id
      );

      if (entryIndex === -1) {
        throw new Error("New entry could not be found.");
      }

      // Navigate to the new entry
      router.push(`/games/${entryIndex}`);
    } catch (error) {
      console.error(
        "Error submitting form:",
        error?.message,
        error?.details,
        error?.hint,
        error?.code
      );
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div>
        <p>You must be logged in to contribute.</p>
        <a href="/login">Login</a>
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
          font-family:
            "Noto Sans Khmer",
            "Noto Sans",
            Arial,
            sans-serif;
        }

        .contribute-form h1 {
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

        .form-field label {
          display: block;
          margin-bottom: 7px;
          font-weight: 600;
          line-height: 1.6;
        }

        .contribute-form input[type="text"],
        .contribute-form textarea,
        .contribute-form input[type="file"] {
          width: 100%;
          box-sizing: border-box;
          font-family:
            "Noto Sans Khmer",
            "Noto Sans",
            Arial,
            sans-serif;
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

        .contribute-form input[type="file"] {
          padding: 8px;
          border: 1px solid #234F3D;
          border-radius: 6px;
          background: #F3EBDD;
          color: #234F3D;
          cursor: pointer;
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
          font-family:
            "Noto Sans Khmer",
            "Noto Sans",
            Arial,
            sans-serif;
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
        }
      `}</style>

      <form
        onSubmit={handleSubmit}
        className="contribute-form"
      >
        <h1>Contribute a Game</h1>

        {/* Title */}
        <div className="language-pair">
          <div className="form-field">
            <label htmlFor="title_en">
              Title (English):
            </label>

            <input
              id="title_en"
              type="text"
              name="title_en"
              value={formData.title_en}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            {errors.title_en && (
              <div className="error">
                {errors.title_en}
              </div>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="title_kh">
              Title (Khmer):
            </label>

            <input
              id="title_kh"
              type="text"
              name="title_kh"
              value={formData.title_kh}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            {errors.title_kh && (
              <div className="error">
                {errors.title_kh}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="language-pair">
          <div className="form-field">
            <label htmlFor="description_en">
              Description (English):
            </label>

            <textarea
              id="description_en"
              name="description_en"
              value={formData.description_en}
              onChange={handleTextareaChange}
              disabled={isSubmitting}
            />

            {errors.description_en && (
              <div className="error">
                {errors.description_en}
              </div>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="description_kh">
              Description (Khmer):
            </label>

            <textarea
              id="description_kh"
              name="description_kh"
              value={formData.description_kh}
              onChange={handleTextareaChange}
              disabled={isSubmitting}
            />

            {errors.description_kh && (
              <div className="error">
                {errors.description_kh}
              </div>
            )}
          </div>
        </div>

        {/* How It Is Played */}
        <div className="language-pair">
          <div className="form-field">
            <label htmlFor="how_it_is_played_en">
              How It Is Played (English):
            </label>

            <textarea
              id="how_it_is_played_en"
              name="how_it_is_played_en"
              value={formData.how_it_is_played_en}
              onChange={handleTextareaChange}
              disabled={isSubmitting}
            />

            {errors.how_it_is_played_en && (
              <div className="error">
                {errors.how_it_is_played_en}
              </div>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="how_it_is_played_kh">
              How It Is Played (Khmer):
            </label>

            <textarea
              id="how_it_is_played_kh"
              name="how_it_is_played_kh"
              value={formData.how_it_is_played_kh}
              onChange={handleTextareaChange}
              disabled={isSubmitting}
            />

            {errors.how_it_is_played_kh && (
              <div className="error">
                {errors.how_it_is_played_kh}
              </div>
            )}
          </div>
        </div>

        {/* Rules */}
        <div className="language-pair">
          <div className="form-field">
            <label htmlFor="rules_en">
              Rules (English):
            </label>

            <textarea
              id="rules_en"
              name="rules_en"
              value={formData.rules_en}
              onChange={handleTextareaChange}
              disabled={isSubmitting}
            />

            {errors.rules_en && (
              <div className="error">
                {errors.rules_en}
              </div>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="rules_kh">
              Rules (Khmer):
            </label>

            <textarea
              id="rules_kh"
              name="rules_kh"
              value={formData.rules_kh}
              onChange={handleTextareaChange}
              disabled={isSubmitting}
            />

            {errors.rules_kh && (
              <div className="error">
                {errors.rules_kh}
              </div>
            )}
          </div>
        </div>

        {/* Contributor */}
        <div className="language-pair">
          <div className="form-field">
            <label htmlFor="contributor_en">
              Contributor (English):
            </label>

            <input
              id="contributor_en"
              type="text"
              name="contributor_en"
              value={formData.contributor_en}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            {errors.contributor_en && (
              <div className="error">
                {errors.contributor_en}
              </div>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="contributor_kh">
              Contributor (Khmer):
            </label>

            <input
              id="contributor_kh"
              type="text"
              name="contributor_kh"
              value={formData.contributor_kh}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            {errors.contributor_kh && (
              <div className="error">
                {errors.contributor_kh}
              </div>
            )}
          </div>
        </div>

        {/* Place */}
        <div className="language-pair">
          <div className="form-field">
            <label htmlFor="place_en">
              Place (English):
            </label>

            <input
              id="place_en"
              type="text"
              name="place_en"
              value={formData.place_en}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            {errors.place_en && (
              <div className="error">
                {errors.place_en}
              </div>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="place_kh">
              Place (Khmer):
            </label>

            <input
              id="place_kh"
              type="text"
              name="place_kh"
              value={formData.place_kh}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            {errors.place_kh && (
              <div className="error">
                {errors.place_kh}
              </div>
            )}
          </div>
        </div>

        {/* Photo */}
        <div className="form-field">
          <label htmlFor="photo">
            Photo:
          </label>

          <input
            id="photo"
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handlePhotoChange}
            disabled={isSubmitting}
          />

          {errors.photo && (
            <div className="error">
              {errors.photo}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
}