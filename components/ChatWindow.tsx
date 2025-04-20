import styles from "../styles/components/ChatWindow.module.scss";
import { Message } from "../types/message";
import MessageBubble from "./MessageBubble";

interface ChatWindowProps {
  messages: Message[];
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  return (
    <div className={styles.container}>
      {messages.map((msg, index) => (
        <MessageBubble key={index} {...msg} />
      ))}
    </div>
  );
}
