import ChatWindow from "../../components/ChatWindow";
import ChatInput from "../../components/ChatInput";
import styles from "../../styles/chat/ChatPage.module.scss";
import chatStyles from "../../styles/chat/components/ChatWindow.module.scss";
import ImageModal from "../../components/ImageModal";
import { useState, useEffect } from "react";
import { Message } from "../../types/message";
import api from "../../utils/api";
import { withAuthSSR } from "../../utils/withAuthSSR";
import { useAuth } from "@/contexts/AuthContext";

export const getServerSideProps = withAuthSSR();

export default function ChatPage() {
  const { setIsLoggedIn } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [context, setContext] = useState<any[]>([]);
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const isLoading = isLoadingStory || isLoadingImage;

  // Story setup
  const [hasStarted, setHasStarted] = useState(false);
  const [storyteller, setStoryteller] = useState<any>(null);
  const [character, setCharacter] = useState<any>(null);
  const [storytellers, setStorytellers] = useState<any[]>([]);
  const [characters, setCharacters] = useState<any[]>([]);

  useEffect(() => {
    setIsLoggedIn(true);

    const fetchOptions = async () => {
      try {
        const [sRes, cRes] = await Promise.all([
          api.get("/storytellers"),
          api.get("/characters"),
        ]);
        setStorytellers(sRes.data);
        setCharacters(cRes.data);
      } catch (err) {
        console.error("Error fetching options:", err);
      }
    };

    fetchOptions();

    const handleImageClick = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail === "string") {
        setActiveImage(detail);
      }
    };

    window.addEventListener("imageClick", handleImageClick);
    return () => window.removeEventListener("imageClick", handleImageClick);
  }, []);

  const handleStartStory = async () => {
    if (!storyteller || !character) return;

    const prompt = `Begin an immersive RPG story. The storyteller is titled "${storyteller.title}" with a ${storyteller.tone} tone and ${storyteller.genre} genre. The story begins with the character "${character.name}", whose role is ${character.role}, traits are ${character.traits}, and has the backstory: ${character.backstory}. Start the adventure with a cinematic opening.`;

    try {
      setIsLoadingStory(true);

      const storyRes = await api.post("/generate_story", {
        message: prompt,
        context: [],
      });

      const storyText = storyRes.data.response;
      const newContext = [
        { role: "user", content: prompt },
        { role: "assistant", content: storyText },
      ];

      const imageRes = await api.post("/generate_image", {
        prompt: storyText,
      });

      const imageURL = imageRes.data.image_url;
      const finalImage = imageURL === "TEST_MODE" ? "/test_wizard.png" : imageURL;

      setMessages([
        { sender: "ai", text: storyText },
        { sender: "ai", text: "🎨 Scene:", image: finalImage },
      ]);
      setContext(newContext);
      setHasStarted(true);
    } catch (err) {
      console.error("Failed to start story:", err);
    } finally {
      setIsLoadingStory(false);
      setIsLoadingImage(false);
    }
  };

  const sendMessage = async (text: string) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
    const updatedContext = [...context, { role: "user", content: text }];

    try {
      setMessages((prev) => [...prev, { sender: "ai", text: "__loading__" }]);
      setIsLoadingStory(true);

      const storyRes = await api.post("/generate_story", {
        message: text,
        context: updatedContext,
      });

      setIsLoadingStory(false);
      const storyText = storyRes.data.response;
      const newContext = [...updatedContext, { role: "assistant", content: storyText }];

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "ai", text: storyText };
        return updated;
      });

      setMessages((prev) => [...prev, { sender: "ai", text: "__image_loading__" }]);
      setIsLoadingImage(true);

      const imageRes = await api.post("/generate_image", {
        prompt: storyText,
      });

      setIsLoadingImage(false);
      const imageURL = imageRes.data.image_url;
      const finalImageUrl =
        imageURL === "TEST_MODE" ? "/test_wizard.png" : imageURL;

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "ai",
          text: "🎨 Scene:",
          image: finalImageUrl,
        };
        return updated;
      });

      setContext(newContext);
    } catch (err) {
      console.error("Error:", err);
      setIsLoadingStory(false);
      setIsLoadingImage(false);
    }
  };

  if (!hasStarted) {
    return (
      <main className={styles.main}>
        <div className={styles.selectorBox}>
          <h2>🎭 Choose Your Story Setup</h2>

          <div className={styles.horizontalSection}>
            <h3>📖 Select a Storyteller</h3>
            <div className={styles.horizontalScroll}>
              {storytellers.map((s) => (
                <div
                  key={s.id}
                  className={`${styles.card} ${storyteller?.id === s.id ? styles.selected : ""}`}
                  onClick={() => setStoryteller(s)}
                >
                  <h4>{s.title}</h4>
                  <p>{s.genre} • {s.tone}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.horizontalSection}>
            <h3>🧝 Select a Character</h3>
            <div className={styles.horizontalScroll}>
              {characters.map((c) => (
                <div
                  key={c.id}
                  className={`${styles.card} ${character?.id === c.id ? styles.selected : ""}`}
                  onClick={() => setCharacter(c)}
                >
                  <h4>{c.name}</h4>
                  <p>{c.role} • {c.traits}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {storyteller && character && (
          <div className={styles.startBox}>
            <div className={styles.startRow}>
              <div className={styles.infoCard}>
                <strong>🧙 Storyteller:</strong> {storyteller.title}
              </div>
              <div className={styles.infoCard}>
                <strong>🧝 Character:</strong> {character.name}
              </div>
              <button onClick={handleStartStory} className={styles.startBtn}>
                🚀 Begin Story with 1 💎
              </button>
            </div>
          </div>
        )}

      </main>
    );
  }



  return (
    <main className={styles.main}>
      <div className={`${chatStyles.container} ${isLoading ? chatStyles.loadingBorder : ""}`}>
        <ChatWindow messages={messages} />
      </div>
      {activeImage && <ImageModal imageUrl={activeImage} onClose={() => setActiveImage(null)} />}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </main>
  );
}
