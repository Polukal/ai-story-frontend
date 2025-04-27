import { useState, useEffect } from "react";
import ChatWindow from "../../components/ChatWindow";
import ChatInput from "../../components/ChatInput";
import ImageModal from "../../components/ImageModal";
import styles from "../../styles/chat/ChatPage.module.scss";
import chatStyles from "../../styles/chat/components/ChatWindow.module.scss";
import api from "../../utils/api";
import { withAuthSSR } from "../../utils/withAuthSSR";
import { useAuth } from "@/contexts/AuthContext";
import { Message } from "../../types/message";
import CreditModal from "@/components/CreditModal";

export const getServerSideProps = withAuthSSR();

export default function ChatPage() {
  const { setIsLoggedIn } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [context, setContext] = useState<any[]>([]);
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const isLoading = isLoadingStory || isLoadingImage;
  const [showCreditModal, setShowCreditModal] = useState(false);

  const [hasStarted, setHasStarted] = useState(false);
  const [storyteller, setStoryteller] = useState<any>(null);
  const [character, setCharacter] = useState<any>(null);
  const [storytellers, setStorytellers] = useState<any[]>([]);
  const [characters, setCharacters] = useState<any[]>([]);

  const [inputValue, setInputValue] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5050";

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
    setIsLoadingStory(true);

    try {
      const storyRes = await api.post("/generate_story", {
        context: [],
        storyteller,
        character,
      });

      const storyText = storyRes.data.response;
      const newContext = [
        { role: "user", content: "__START__" },
        { role: "assistant", content: storyText },
      ];

      const imageRes = await api.post("/generate_image", {
        prompt: storyText,
        storyteller,
        character,
      });

      const imageURL = imageRes.data.image_url;
      const finalImage = imageURL === "TEST_MODE" ? "/avatar_wizard.png" : imageURL;

      setMessages([
        { sender: "ai", text: storyText },
        { sender: "ai", text: "🎨 Scene:", image: finalImage },
      ]);
      setContext(newContext);
      setHasStarted(true);
    } catch (err: any) {
      console.log(err.response?.data?.error);
      if (err?.response?.status === 403 && err?.response?.data?.error === "Insufficient credits") {
        setShowCreditModal(true);
      } else {
        console.error("Failed to start story:", err);
      }
    } finally {
      setIsLoadingStory(false);
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
      const finalImageUrl = imageURL === "TEST_MODE" ? "/avatar_wizard.png" : imageURL;

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
              {storytellers.length === 0 ? (
                <p className={styles.emptyMessage}>No Storyteller found</p>
              ) : (
                storytellers.map((s) => (
                  <div
                    key={s.id}
                    className={`${styles.card} ${storyteller?.id === s.id ? styles.selected : ""}`}
                    onClick={() => !isLoadingStory && setStoryteller(s)}
                  >
                    <div className={styles.cardContent}>
                      <img
                        src={s.image_url ? `${backendUrl}${s.image_url}` : "/avatar_wizard.png"}
                        className={styles.cardImage}
                        alt={s.title}
                      />
                      <div>
                        <h4>{s.title}</h4>
                        <p>{s.genre} • {s.tone}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.horizontalSection}>
            <h3>🧝 Select a Character</h3>
            <div className={styles.horizontalScroll}>
              {characters.length === 0 ? (
                <p className={styles.emptyMessage}>No Character found</p>
              ) : (
                characters.map((c) => (
                  <div
                    key={c.id}
                    className={`${styles.card} ${character?.id === c.id ? styles.selected : ""}`}
                    onClick={() => !isLoadingStory && setCharacter(c)}
                  >
                    <div className={styles.cardContent}>
                      <img
                        src={c.image_url ? `${backendUrl}${c.image_url}` : "/avatar_wizard.png"}
                        className={styles.cardImage}
                        alt={c.name}
                      />
                      <div>
                        <h4>{c.name}</h4>
                        <p>{c.role} • {c.traits}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {storyteller && character && (
          <div className={styles.startBox}>
            <div className={styles.startRow}>
              <div className={styles.infoCard}>
                <img
                  src={storyteller.image_url ? `${backendUrl}${storyteller.image_url}` : "/avatar_wizard.png"}
                  className={styles.imageBottom}
                  alt={storyteller.title}
                />
                <div className={styles.selectedBoxBottom}>
                  <strong>🧙 Storyteller:</strong> {storyteller.title}
                </div>
              </div>
              <div className={styles.infoCard}>
                <img
                  src={character.image_url ? `${backendUrl}${character.image_url}` : "/avatar_wizard.png"}
                  className={styles.imageBottom}
                  alt={character.name}
                />
                <div className={styles.selectedBoxBottom}>
                  <strong>🧝 Character:</strong> {character.name}
                </div>
              </div>
              <button
                onClick={handleStartStory}
                className={styles.startBtn}
                disabled={isLoadingStory}
              >
                {isLoadingStory ? "Loading..." : "🚀 Begin Story with 5 💎"}
              </button>
            </div>
          </div>
        )}
        {showCreditModal && <CreditModal onClose={() => setShowCreditModal(false)} />}
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.sidebar}>
        <div className={styles.profileCard}>
          <h3>Storyteller</h3>
          <img
            src={storyteller?.image_url ? `${backendUrl}${storyteller.image_url}` : "/avatar_wizard.png"}
            className={styles.sidebarImage}
            alt={storyteller?.title}
          />
          <h4>{storyteller?.title}</h4>
          <p>{storyteller?.genre} • {storyteller?.tone}</p>
        </div>
        <div className={styles.profileCard}>
          <h3>Player Character</h3>
          <img
            src={character?.image_url ? `${backendUrl}${character.image_url}` : "/avatar_wizard.png"}
            className={styles.sidebarImage}
            alt={character?.name}
          />
          <h4>{character?.name}</h4>
          <p>{character?.role}</p>
          <small>{character?.traits}</small>
        </div>
      </div>
      <div className={`${chatStyles.container} ${isLoading ? chatStyles.loadingBorder : ""}`}>
        <ChatWindow
          messages={messages}
          disabled={isLoading}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      </div>
      {activeImage && <ImageModal imageUrl={activeImage} onClose={() => setActiveImage(null)} />}
      <ChatInput
        onSend={sendMessage}
        disabled={isLoading}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
    </main>
  );
}
