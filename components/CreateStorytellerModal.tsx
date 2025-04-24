import { useState } from "react";
import styles from "../styles/components/CreateStorytellerModal.module.scss";
import api from "../utils/api";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateStorytellerModal({ onClose, onCreated }: Props) {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    tone: "",
    plot_setup: "",
    visual_style: "",
  });

  const [custom, setCustom] = useState({
    genre: false,
    tone: false,
    visual_style: false,
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
      await api.post("/storytellers", formData);
      onCreated();
      onClose();
    } catch (err: any) {
      console.error("Error creating storyteller:", err);
      setError("Failed to create storyteller.");
    } finally {
      setLoading(false);
    }
  };

  const genreOptions = ["Fantasy", "Sci-Fi", "Mystery", "Historical", "Post-Apocalyptic", "Custom"];
  const toneOptions = ["Dark", "Whimsical", "Tragic", "Hopeful", "Epic", "Custom"];
  const visualOptions = ["Realistic", "Comic", "Painterly", "Pixel Art", "Anime", "Custom"];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Create New Storyteller</h2>

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

        <div className={styles.formControl}>
          <label className={styles.label}>Genre</label>
          {!custom.genre ? (
            <select
              className={styles.select}
              onChange={(e) => handleSelect("genre", e.target.value)}
              value={formData.genre}
            >
              <option value="">Select Genre</option>
              {genreOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <div className={styles.customInputWrapper}>
              <input
                type="text"
                name="genre"
                placeholder="Your Custom Genre"
                className={styles.input}
                value={formData.genre}
                onChange={handleChange}
              />
              <button onClick={() => handleCancelCustom("genre")} className={styles.cancelX}>❌</button>
            </div>
          )}
        </div>

        <div className={styles.formControl}>
          <label className={styles.label}>Tone</label>
          {!custom.tone ? (
            <select
              className={styles.select}
              onChange={(e) => handleSelect("tone", e.target.value)}
              value={formData.tone}
            >
              <option value="">Select Tone</option>
              {toneOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <div className={styles.customInputWrapper}>
              <input
                type="text"
                name="tone"
                placeholder="Your Custom Tone"
                className={styles.input}
                value={formData.tone}
                onChange={handleChange}
              />
              <button onClick={() => handleCancelCustom("tone")} className={styles.cancelX}>❌</button>
            </div>
          )}
        </div>

        <div className={styles.formControl}>
          <label className={styles.label}>Visual Style</label>
          {!custom.visual_style ? (
            <select
              className={styles.select}
              onChange={(e) => handleSelect("visual_style", e.target.value)}
              value={formData.visual_style}
            >
              <option value="">Select Visual Style</option>
              {visualOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <div className={styles.customInputWrapper}>
              <input
                type="text"
                name="visual_style"
                placeholder="Your Custom Visual Style"
                className={styles.input}
                value={formData.visual_style}
                onChange={handleChange}
              />
              <button onClick={() => handleCancelCustom("visual_style")} className={styles.cancelX}>❌</button>
            </div>
          )}
        </div>

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
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
