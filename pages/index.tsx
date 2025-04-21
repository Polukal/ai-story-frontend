import Link from "next/link";
import styles from "../styles/Landing.module.scss";

export default function Home() {
  return (
    <>
      <h1 className={styles.title}>🧙‍♂️ AI Story Creator</h1>

      <p className={styles.subtitle}>
        Enter a realm where imagination and magic come alive. Generate your own interactive fantasy stories with AI-powered narration and visuals.
      </p>
      <Link href="/chat" className={styles.button}>
        Enter the Realm
      </Link>
    </>
  );
}
