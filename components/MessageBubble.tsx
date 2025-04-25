import styles from "../styles/chat/components/MessageBubble.module.scss";
import { Message } from "../types/message";

interface Props extends Message {
  setInputValue: (value: string) => void;
  disabled: boolean;
}

export default function MessageBubble({ sender, text, image, setInputValue, disabled }: Props) {
  // Replace **bold** with <strong>
  function parseMarkdown(input: string): string {
    return input.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  // Extract choices & return [cleanedText, choices[]]
  function extractChoicesAndCleanText(text: string): [string, string[]] {
    const lines = text.split("\n");
    const choiceLines: string[] = [];

    const cleanedLines = lines.filter((line) => {
      const trimmed = line.trim();
      if (trimmed.toLowerCase() === "choices:") return false;
      if (/^\d+\.\s+/.test(trimmed)) {
        choiceLines.push(trimmed);
        return false;
      }
      return true;
    });

    return [cleanedLines.join("\n"), choiceLines];
  }

  const [cleanedText, choices] =
    sender === "ai" ? extractChoicesAndCleanText(text) : [text, []];

  if (text === "__loading__") {
    return (
      <div className={styles.loaderBubble}>
        The Purple Wizard is weaving the story.
      </div>
    );
  }

  if (text === "__image_loading__") {
    return (
      <div className={styles.loaderBubble}>
        The Purple Wizard is painting the scene
      </div>
    );
  }

  const baseClass = image
    ? styles.imageBubble
    : `${styles.bubble} ${sender === "user" ? styles.user : styles.ai}`;

  return (
    <div className={baseClass}>
      <div
        className={styles.response_text}
        dangerouslySetInnerHTML={{ __html: parseMarkdown(cleanedText) }}
      />
      {image && (
        <img
          src={image}
          alt="Story visual"
          className={styles.image}
          onClick={() =>
            window.dispatchEvent(new CustomEvent("imageClick", { detail: image }))
          }
          style={{ cursor: "pointer" }}
        />
      )}
      {choices.length > 0 && (
        <div className={styles.choiceButtons}>
          {choices.map((choice, index) => (
            <button
              key={index}
              className={styles.choiceButton}
              onClick={() => setInputValue(choice)}
              disabled={disabled}
            >
              {choice}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
