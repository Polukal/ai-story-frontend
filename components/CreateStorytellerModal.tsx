import { useEffect, useState } from "react";
import styles from "../styles/components/CreateStorytellerModal.module.scss";
import api from "../utils/api";
import { withAuthSSR } from "../utils/withAuthSSR";
import { useAuth } from "@/contexts/AuthContext";

export const getServerSideProps = withAuthSSR();

type Props = {
    onClose: () => void;
    onCreated: () => void;
};

export default function CreateStorytellerModal({ onClose, onCreated }: Props) {
    const { setIsLoggedIn } = useAuth();
    useEffect(() => {
        setIsLoggedIn(true);
    }, []);

    const [formData, setFormData] = useState({
        title: "",
        genre: "",
        tone: "",
        plot_setup: "",
        visual_style: "",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
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
        setError("");

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });
            if (imageFile) {
                data.append("image", imageFile);
            }

            await api.post("/storytellers", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

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

                {/* Genre, Tone, Visual Style Selects */}
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
                                    <option value="">Select {field}</option>
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

                {/* Plot Setup */}
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

                {/* Upload Image */}
                <div className={styles.formControl}>
                    <label className={styles.label}>Upload Storyteller Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                </div>

                {/* Error */}
                {error && <div className={styles.error}>{error}</div>}

                {/* Buttons */}
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
