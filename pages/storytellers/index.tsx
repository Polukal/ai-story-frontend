import { useEffect, useState } from "react";
import api from "../../utils/api";
import styles from "../../styles/pages/Storytellers.module.scss";
import { withAuthSSR } from "../../utils/withAuthSSR";
import { useAuth } from "@/contexts/AuthContext";
import CreateStorytellerModal from "@/components/CreateStorytellerModal";

export const getServerSideProps = withAuthSSR();

type Storyteller = {
  id: number;
  title: string;
  genre: string;
  tone: string;
  plot_setup: string;
  visual_style: string;
};

export default function StorytellersPage() {
  const { setIsLoggedIn } = useAuth();
  const [storytellers, setStorytellers] = useState<Storyteller[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    setIsLoggedIn(true);
    const fetchStorytellers = async () => {
      try {
        const res = await api.get("/storytellers");
        setStorytellers(res.data);
      } catch (err) {
        console.error("Error fetching storytellers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStorytellers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this storyteller?")) return;
    try {
      await api.delete(`/storytellers/${id}`);
      setStorytellers(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error("Failed to delete storyteller:", err);
    }
  };

  if (loading) return <div className={styles.loading}>Loading storytellers...</div>;

  return (
    <div className={styles.storytellersContainer}>
      <h1>📖 Your Storytellers</h1>
      <div className={styles.grid}>
        {storytellers.map((s) => (
          <div key={s.id} className={styles.card}>
            <h2>{s.title}</h2>
            <p><strong>Genre:</strong> {s.genre}</p>
            <p><strong>Tone:</strong> {s.tone}</p>
            <p><strong>Visual Style:</strong> {s.visual_style}</p>
            <p className={styles.plot}><strong>Setup:</strong> {s.plot_setup}</p>
            <div className={styles.actions}>
              <button onClick={() => alert("Edit modal coming soon!")}>✏️ Edit</button>
              <button onClick={() => handleDelete(s.id)}>🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.createBtn} onClick={() => setShowCreateModal(true)}>
        ➕ Create New Storyteller
      </button>

      {showCreateModal && (
        <CreateStorytellerModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => window.location.reload()} // Or re-fetch state more cleanly
        />
      )}
    </div>
  );
}
