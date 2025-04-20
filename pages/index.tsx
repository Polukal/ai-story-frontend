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
    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text }]);
    const updatedContext = [...context, { role: "user", content: text }];
  
    try {
      // Add 1 loading bubble for story
      setMessages((prev) => [...prev, { sender: "ai", text: "__loading__" }]);
      setIsLoadingStory(true);
  
      const storyRes = await api.post("/generate_story", {
        message: text,
        context: updatedContext,
      });
  
      setIsLoadingStory(false);
      const storyText = storyRes.data.response;
      const newContext = [...updatedContext, { role: "assistant", content: storyText }];
  
      // Replace loading bubble with story
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "ai", text: storyText };
        return updated;
      });
  
      // Add 1 loading bubble for image
      setMessages((prev) => [...prev, { sender: "ai", text: "__image_loading__" }]);
      setIsLoadingImage(true);
  
      const imageRes = await api.post("/generate_image", {
        prompt: storyText,
      });
  
      setIsLoadingImage(false);
      const imageURL = imageRes.data.image_url;
      const finalImageUrl =
        imageURL === "TEST_MODE" ? "/test_wizard.png" : imageURL;
  
      // Replace image loading with image
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
  

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>🧙‍♂️ AI Story Creator</h1>

      <div
        className={`${chatStyles.container} ${isLoading ? chatStyles.loadingBorder : ""
          }`}
      >
        <ChatWindow messages={messages} />
      </div>

      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </main>

  );
}
