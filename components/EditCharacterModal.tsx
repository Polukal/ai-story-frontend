import { useState } from "react";
import styles from "../styles/components/CreateStorytellerModal.module.scss";
import api from "../utils/api";

type Character = {
  id: number;
  name: string;
  role: string;
  traits: string;
  backstory: string;
  image_url?: string;
};

type Props = {
  character: Character;
  onClose: () => void;
  onUpdated: () => void;
};

export default function EditCharacterModal({ character, onClose, onUpdated }: Props) {
  const [formData, setFormData] = useState({ ...character });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.backstory.trim()) {
      setError("Character Name and Backstory are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("role", formData.role);
      data.append("traits", formData.traits);
      data.append("backstory", formData.backstory);
      if (imageFile) {
        data.append("image", imageFile);
      }

      await api.put(`/characters/${character.id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onUpdated();
      onClose();
    } catch (err: any) {
      console.error("Error updating character:", err);
      setError("Failed to update character.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Edit Character</h2>

        <div className={styles.formControl}>
          <label className={styles.label}>Character Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter character name"
            className={styles.input}
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formControl}>
          <label className={styles.label}>Role</label>
          <input
            type="text"
            name="role"
            placeholder="e.g., Commander, Sorcerer, Thief"
            className={styles.input}
            value={formData.role}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formControl}>
          <label className={styles.label}>Traits</label>
          <input
            type="text"
            name="traits"
            placeholder="e.g., Brave, Cunning, Loyal"
            className={styles.input}
            value={formData.traits}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formControl}>
          <label className={styles.label}>Backstory</label>
          <textarea
            name="backstory"
            placeholder="Enter backstory"
            className={styles.textarea}
            rows={4}
            value={formData.backstory}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formControl}>
          <label className={styles.label}>Change Picture (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
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
