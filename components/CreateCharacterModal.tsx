import { useState } from "react";
import styles from "../styles/components/CreateStorytellerModal.module.scss";
import api from "../utils/api";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateCharacterModal({ onClose, onCreated }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    traits: "",
    backstory: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.backstory.trim()) {
      setError("Character Name and Backstory are required.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/characters", formData);
      onCreated();
      onClose();
    } catch (err: any) {
      console.error("Error creating character:", err);
      setError("Failed to create character.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Create New Character</h2>

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

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
