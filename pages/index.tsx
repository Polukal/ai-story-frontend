import { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import api from "../utils/api";
import { Message } from "../types/message";
import styles from "../styles/Home.module.scss";
import chatStyles from "../styles/components/ChatWindow.module.scss";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [context, setContext] = useState<any[]>([]);
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const isLoading = isLoadingStory || isLoadingImage;

  const sendMessage = async (text: string) => {
    // Add user message to chat
    setMessages((prev) => [...prev, { sender: "user", text }]);
    const updatedContext = [...context, { role: "user", content: text }];

    try {
      // Story generation
      setIsLoadingStory(true);
      const storyRes = await api.post("/generate_story", {
        message: text,
        context: updatedContext,
      });
      setIsLoadingStory(false);

      const storyText = storyRes.data.response;
      const newContext = [...updatedContext, { role: "assistant", content: storyText }];
      setMessages((prev) => [...prev, { sender: "ai", text: storyText }]);

      // Image generation
      setIsLoadingImage(true);
      const imageRes = await api.post("/generate_image", {
        prompt: storyText,
      });
      setIsLoadingImage(false);

      const imageURL = imageRes.data.image_url;
      const finalImageUrl =
        imageURL === "TEST_MODE" ? "/test_wizard.png" : imageURL;

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "🎨 Scene:", image: finalImageUrl },
      ]);

      setContext(newContext);
    } catch (err) {
      console.error("Error:", err);
      setIsLoadingStory(false);
      setIsLoadingImage(false);
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>🧙‍♂️ AI Story Creator</h1>

      <div
        className={`${chatStyles.container} ${
          isLoading ? chatStyles.glowing : ""
        }`}
      >
        <ChatWindow messages={messages} />
      </div>

      {isLoadingStory && <div className={styles.loader}>✍️ Crafting story...</div>}
      {isLoadingImage && <div className={styles.loader}>🎨 Painting scene...</div>}

      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </main>
  );
}
