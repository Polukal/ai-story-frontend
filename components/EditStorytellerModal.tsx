import { useState } from "react";
import styles from "../styles/components/CreateStorytellerModal.module.scss";
import api from "../utils/api";

type Props = {
  storyteller: any;
  onClose: () => void;
  onUpdated: () => void;
};

const genreOptions = ["Fantasy", "Sci-Fi", "Mystery", "Historical", "Post-Apocalyptic", "Custom"];
const toneOptions = ["Dark", "Whimsical", "Tragic", "Hopeful", "Epic", "Custom"];
const visualOptions = ["Realistic", "Comic", "Painterly", "Pixel Art", "Anime", "Custom"];

export default function EditStorytellerModal({ storyteller, onClose, onUpdated }: Props) {
  const [formData, setFormData] = useState({ ...storyteller });

  const [custom, setCustom] = useState({
    genre: !genreOptions.includes(storyteller.genre),
    tone: !toneOptions.includes(storyteller.tone),
    visual_style: !visualOptions.includes(storyteller.visual_style),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (field: keyof typeof formData, value: string) => {
    if (value === "Custom") {
      setCustom({ ...custom, [field]: true });
      setFormData({ ...formData, [field]: "" });
    } else {
      setFormData({ ...formData, [field]: value });
      setCustom({ ...custom, [field]: false });
    }
  };

  const handleCancelCustom = (field: keyof typeof custom) => {
    setCustom({ ...custom, [field]: false });
    setFormData({ ...formData, [field]: "" });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.plot_setup.trim()) {
      setError("Storyteller Name and Plot Setup are required.");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/storytellers/${storyteller.id}`, formData);
      onUpdated();
      onClose();
    } catch (err: any) {
      console.error("Error updating storyteller:", err);
      setError("Failed to update storyteller.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Edit Storyteller</h2>

        <div className={styles.formControl}>
          <label className={styles.label}>Storyteller Name</label>
          <input
            type="text"
            name="title"
            placeholder="Enter storyteller name"
            className={styles.input}
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {["genre", "tone", "visual_style"].map((field) => {
          const options = { genre: genreOptions, tone: toneOptions, visual_style: visualOptions }[field]!;
          const isCustom = custom[field as keyof typeof custom];

          return (
            <div className={styles.formControl} key={field}>
              <label className={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")}</label>
              {!isCustom ? (
                <select
                  className={styles.select}
                  onChange={(e) => handleSelect(field as keyof typeof formData, e.target.value)}
                  value={formData[field as keyof typeof formData]}
                >
                  <option value="">{`Select ${field}`}</option>
                  {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <div className={styles.customInputWrapper}>
                  <input
                    type="text"
                    name={field}
                    placeholder={`Your Custom ${field}`}
                    className={styles.input}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleChange}
                  />
                  <button onClick={() => handleCancelCustom(field as keyof typeof custom)} className={styles.cancelX}>❌</button>
                </div>
              )}
            </div>
          );
        })}

        <div className={styles.formControl}>
          <label className={styles.label}>Plot Setup</label>
          <textarea
            name="plot_setup"
            placeholder="Initial Plot Setup"
            className={styles.textarea}
            rows={4}
            value={formData.plot_setup}
            onChange={handleChange}
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
