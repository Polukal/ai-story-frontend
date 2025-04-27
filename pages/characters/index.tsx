import { useEffect, useState } from "react";
import api from "../../utils/api";
import styles from "../../styles/pages/Characters.module.scss";
import { withAuthSSR } from "../../utils/withAuthSSR";
import { useAuth } from "@/contexts/AuthContext";
import CreateCharacterModal from "@/components/CreateCharacterModal";
import EditCharacterModal from "@/components/EditCharacterModal";

export const getServerSideProps = withAuthSSR();

type Character = {
  id: number;
  name: string;
  role: string;
  traits: string;
  backstory: string;
  image_url?: string;
};

export default function CharactersPage() {
  const { setIsLoggedIn } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selected, setSelected] = useState<Character | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchCharacters = async () => {
    try {
      const res = await api.get("/characters");
      setCharacters(res.data);
    } catch (err) {
      console.error("Error fetching characters:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsLoggedIn(true);
    fetchCharacters();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this character?")) return;
    try {
      await api.delete(`/characters/${id}`);
      setCharacters(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Failed to delete character:", err);
    }
  };

  if (loading) return <div className={styles.loading}>Loading characters...</div>;

  return (
    <div className={styles.charactersContainer}>
      <h1>🧝 Your Characters</h1>
      <div className={styles.grid}>
        {characters.map((c) => (
          <div key={c.id} className={styles.card}>
            {/* Always show an image — real or default */}
            <img
              src={c.image_url ? `${backendUrl}${c.image_url}` : "/avatar_wizard.png"}
              alt={c.name}
              className={styles.characterImage}
            />
            <h2>{c.name}</h2>
            <p><strong>Role:</strong> {c.role}</p>
            <p><strong>Traits:</strong> {c.traits}</p>
            <p className={styles.backstory}><strong>Backstory:</strong> {c.backstory}</p>
            <div className={styles.actions}>
              <button onClick={() => setSelected(c)}>✏️ Edit</button>
              <button onClick={() => handleDelete(c.id)}>🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.createBtn} onClick={() => setShowCreateModal(true)}>
        ➕ Create New Character
      </button>

      {showCreateModal && (
        <CreateCharacterModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchCharacters}
        />
      )}

      {selected && (
        <EditCharacterModal
          character={selected}
          onClose={() => setSelected(null)}
          onUpdated={fetchCharacters}
        />
      )}
    </div>
  );
}
