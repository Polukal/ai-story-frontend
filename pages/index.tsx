import { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import api from "../utils/api";
import { Message } from "../types/message";
import styles from "../styles/Home.module.scss";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [context, setContext] = useState<any[]>([]); // You can type this later

  const sendMessage = async (text: string) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
    const updatedContext = [...context, { role: "user", content: text }];

    const storyRes = await api.post("/generate_story", {
      message: text,
      context: updatedContext,
    });

    const storyText = storyRes.data.response;
    const newContext = [...updatedContext, { role: "assistant", content: storyText }];

    setMessages((prev) => [...prev, { sender: "ai", text: storyText }]);

    const imageRes = await api.post("/generate_image", {
      prompt: storyText,
    });

    const imageURL = imageRes.data.image_url;
    setMessages((prev) => [...prev, { sender: "ai", text: "🎨 Scene:", image: imageURL }]);

    setContext(newContext);
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>🧙‍♂️ AI Story Creator</h1>
      <ChatWindow messages={messages} />
      <ChatInput onSend={sendMessage} />
    </main>
  );
}
