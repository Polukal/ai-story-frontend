import Link from "next/link";
import styles from "../styles/Landing.module.scss";
import api from "../utils/api";
import { useRouter } from "next/router";

export default function Home() {

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🧙‍♂️ AI Story Creator</h1>
      <button onClick={handleLogout} style={{ position: "absolute", top: 20, right: 20 }}>
        Logout
      </button>

      <p className={styles.subtitle}>
        Enter a realm where imagination and magic come alive. Generate your own interactive fantasy stories with AI-powered narration and visuals.
      </p>
      <Link href="/chat" className={styles.button}>
        Enter the Realm
      </Link>
    </div>
  );
}
