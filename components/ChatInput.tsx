import styles from "../styles/chat/components/ChatInput.module.scss";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
}

export default function ChatInput({
  onSend,
  disabled,
  inputValue,
  setInputValue,
}: ChatInputProps) {
  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    onSend(inputValue);
    setInputValue(""); // Clear input after sending
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="Continue the story..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={styles.input}
        disabled={disabled}
      />
      <button onClick={handleSubmit} className={styles.button} disabled={disabled}>
        Send
      </button>
    </form>
  );
}
