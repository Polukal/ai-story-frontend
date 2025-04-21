import { useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";
import styles from "../styles/pages/Auth.module.scss";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/login", { email, password }, { withCredentials: true });
      router.push("/chat");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className={styles.container}>
      <Navbar/>
      <h2 className={styles.title}>Login to Your Realm</h2>
      <form className={styles.form} onSubmit={handleLogin}>
        <input type="email" placeholder="Email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className={styles.button}>Login</button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        Don’t have an account? <Link href="/register" className={styles.link}>Create one</Link>
      </p>
    </div>
  );
}
