import styles from "../styles/chat/components/MessageBubble.module.scss";
import { Message } from "../types/message";

interface Props extends Message {
  setInputValue: (value: string) => void;
  disabled: boolean;
  isLastAiMessage: boolean;
}

export default function MessageBubble({
  sender,
  text,
  image,
  setInputValue,
  disabled,
  isLastAiMessage
}: Props) {
  // Replace **bold** with <strong>
  function parseMarkdown(input: string): string {
    return input.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  // Extract numbered choices and clean them from the main text
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

  // Run extraction only if AI message
  const [cleanedText, choices] =
    sender === "ai" ? extractChoicesAndCleanText(text) : [text, []];

  // Special loading states
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
      {choices.length > 0 && isLastAiMessage && (
        <div className={styles.choiceButtons}>
          {choices.map((choice, index) => (
            <button
              key={index}
              className={styles.choiceButton}
              onClick={() => setInputValue(choice)}
              disabled={disabled}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(choice) }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
