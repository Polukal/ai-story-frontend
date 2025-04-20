import { useState } from "react";
import styles from "../styles/components/ChatInput.module.scss";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="Continue the story..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={styles.input}
        disabled={disabled}
      />
      <button type="submit" className={styles.button} disabled={disabled}>
        Send
      </button>
    </form>
  );
}
