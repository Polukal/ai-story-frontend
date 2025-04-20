import { useEffect, useRef } from "react";
import { Message } from "../types/message";
import MessageBubble from "./MessageBubble";
import styles from "../styles/components/ChatWindow.module.scss";

interface ChatWindowProps {
  messages: Message[];
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.container}>
      {messages.map((msg, index) => (
        <MessageBubble key={index} {...msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
