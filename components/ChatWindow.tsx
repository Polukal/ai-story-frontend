import { useEffect, useRef } from "react";
import { Message } from "../types/message";
import MessageBubble from "./MessageBubble";
import styles from "../styles/chat/components/ChatWindow.module.scss";

interface ChatWindowProps {
  messages: Message[];
  disabled: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
}

export default function ChatWindow({ messages, disabled, inputValue, setInputValue }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.container}>
      {messages.map((msg, index) => (
        <MessageBubble disabled={disabled} key={index} {...msg} setInputValue={setInputValue} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
