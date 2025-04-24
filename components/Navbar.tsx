import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "../styles/components/Navbar.module.scss";
import { useRouter } from "next/router";
import api from "../utils/api";
import { useAuth } from "@/contexts/AuthContext";
import CreditModal from "./CreditModal";

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchCredits = async () => {
    try {
      const res = await api.get("/auth/profile");
      setCredits(res.data.credits);
    } catch {
      setCredits(null);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchCredits();
  }, [isLoggedIn]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [dropdownOpen]);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <img src="/purple_wizard_logo.png" alt="Purple Wizard" />
            <span>Purple Wizard</span>
          </Link>

          <div className={styles.right}>
            {isLoggedIn && (
              <>
                <div className={styles.navLinks}>
                  <Link href="/characters" className={styles.linkBtn}>🧝 Characters</Link>
                  <Link href="/storytellers" className={styles.linkBtn}>📖 Storytellers</Link>
                </div>

                {credits !== null && (
                  <div className={styles.credits}>
                    <div className={styles.purple_emoji}>💎</div> {credits}
                    <button className={styles.plus} onClick={() => setShowCreditModal(true)}>+</button>
                  </div>
                )}
              </>
            )}

            <div className={styles.avatarWrapper} ref={dropdownRef}>
              <h1 onClick={() => setDropdownOpen(!dropdownOpen)} className={styles.account}>
                🧑‍💼
              </h1>
              {dropdownOpen && (
                <div className={styles.dropdown}>
                  {isLoggedIn ? (
                    <>
                      <Link href="/account" className={styles.dropdownItem}>
                        My Account
                      </Link>
                      <a href="#" onClick={handleLogout} className={styles.dropdownItem}>
                        Logout
                      </a>
                    </>
                  ) : (
                    <Link href="/login" className={styles.dropdownItem}>
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showCreditModal && <CreditModal onClose={() => setShowCreditModal(false)} />}
    </>
  );
}
