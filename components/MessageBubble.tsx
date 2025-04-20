import styles from "../styles/components/MessageBubble.module.scss";
import { Message } from "../types/message";

interface Props extends Message {}

export default function MessageBubble({ sender, text, image }: Props) {
  if (text === "__loading__") {
    return (
      <div className={styles.loaderBubble}>
        The AI is thinking
      </div>
    );
  }

  if (text === "__image_loading__") {
    return (
      <div className={styles.loaderBubble}>
        The AI is painting the scene
      </div>
    );
  }

  const baseClass = image
    ? styles.imageBubble
    : `${styles.bubble} ${sender === "user" ? styles.user : styles.ai}`;

  return (
    <div className={baseClass}>
      <div>{text}</div>
      {image && (
        <img
        src={image}
        alt="Story visual"
        className={styles.image}
        onClick={() => window.dispatchEvent(new CustomEvent("imageClick", { detail: image }))}
        style={{ cursor: "pointer" }}
      />
      
      )}
    </div>
  );
}
