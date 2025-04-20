import styles from "../styles/components/MessageBubble.module.scss";
import { Message } from "../types/message";

interface Props extends Message {}

export default function MessageBubble({ sender, text, image }: Props) {
  return (
    <div className={`${styles.bubble} ${sender === "user" ? styles.user : styles.ai}`}>
      <div>{text}</div>
      {image && <img src={image} alt="Story visual" className={styles.image} />}
    </div>
  );
}
