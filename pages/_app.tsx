import "@/styles/globals.css";
import styles from "../styles/Landing.module.scss";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
      <div className={styles.container}>
        <Navbar />
        <Component {...pageProps} />
      </div>

  );
}