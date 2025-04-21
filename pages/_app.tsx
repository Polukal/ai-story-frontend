import "@/styles/globals.css";
import styles from "../styles/Landing.module.scss";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "../contexts/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className={styles.container}>
        <Navbar />
        <Component {...pageProps} />
      </div>
    </AuthProvider>

  );
}