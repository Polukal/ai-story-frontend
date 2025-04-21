import { useEffect, useState } from "react";
import ChatWindow from "../../components/ChatWindow";
import ChatInput from "../../components/ChatInput";
import api from "../../utils/api";
import { Message } from "../../types/message";
import styles from "../../styles/chat/ChatPage.module.scss";
import chatStyles from "../../styles/chat/components/ChatWindow.module.scss";
import ImageModal from "../../components/ImageModal";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [context, setContext] = useState<any[]>([]);
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const isLoading = isLoadingStory || isLoadingImage;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    const handleImageClick = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail === "string") {
        setActiveImage(detail);
      }
    };

    window.addEventListener("imageClick", handleImageClick);
    return () => window.removeEventListener("imageClick", handleImageClick);
  }, []);

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

  if (loading) {
    return <div className={styles.loading}>Checking authentication...</div>;
  }

  if (!isAuthenticated) return null;

  return (
    <main className={styles.main}>
      <Link href='/'>
        <h1 className={styles.title}>🧙‍♂️ AI Story Creator</h1>
      </Link>

      <div
        className={`${chatStyles.container} ${isLoading ? chatStyles.loadingBorder : ""}`}
      >
        <ChatWindow messages={messages} />
      </div>

      {activeImage && (
        <ImageModal imageUrl={activeImage} onClose={() => setActiveImage(null)} />
      )}

      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </main>
  );
}
