"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "../../lib/supabase/client.js";

export default function EditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const entryId = searchParams.get("id");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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
        alert("Entry not found.");
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
        alert("Unable to load this entry.");
        router.push("/games");
        return;
      }

      if (data.owner !== user.id) {
        alert("You can only edit your own entries.");
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

    setFormData({
      ...formData,
      [name]: value,
    });
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhotoFile(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const titleEn = formData.title_en.trim();
    const titleKh = formData.title_kh.trim();
    const descriptionEn = formData.description_en.trim();
    const descriptionKh = formData.description_kh.trim();
    const howItIsPlayedEn =
      formData.how_it_is_played_en.trim();
    const howItIsPlayedKh =
      formData.how_it_is_played_kh.trim();
    const rulesEn = formData.rules_en.trim();
    const rulesKh = formData.rules_kh.trim();
    const contributorEn = formData.contributor_en.trim();
    const contributorKh = formData.contributor_kh.trim();
    const placeEn = formData.place_en.trim();
    const placeKh = formData.place_kh.trim();

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

    if (photoFile) {
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

      const { data, error: updateError } = await supabase
        .from("entries")
        .update({
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
          photo_url: photoUrl,
        })
        .eq("id", entryId)
        .select();

      if (updateError) {
        throw updateError;
      }

      if (!data || data.length === 0) {
        console.error("Update returned no row.");
        alert("That change wasn't saved");
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
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
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
          font-family:
            "Noto Sans Khmer",
            "Noto Sans",
            Arial,
            sans-serif;
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

        .form-field label {
          display: block;
          margin-bottom: 7px;
          font-weight: 600;
          line-height: 1.6;
        }

        .edit-form input[type="text"],
        .edit-form textarea,
        .edit-form input[type="file"] {
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

        .edit-form input[type="text"],
        .edit-form textarea {
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

        .edit-form input[type="file"] {
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
        <h1>Edit Game</h1>

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
              <div className="error">{errors.title_en}</div>
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
              <div className="error">{errors.title_kh}</div>
            )}
          </div>
        </div>

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
              <div className="error">{errors.rules_en}</div>
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
              <div className="error">{errors.rules_kh}</div>
            )}
          </div>
        </div>

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
              <div className="error">{errors.place_en}</div>
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
              <div className="error">{errors.place_kh}</div>
            )}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="photo">
            Photo (optional):
          </label>

          <input
            id="photo"
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handlePhotoChange}
            disabled={isSubmitting}
          />

          {errors.photo && (
            <div className="error">{errors.photo}</div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </>
  );
}