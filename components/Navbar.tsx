import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/components/Navbar.module.scss";
import { useRouter } from "next/router";
import axios from "axios";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:5050/api/auth/profile", {
          withCredentials: true,
        });
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5050/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error", err);
    }
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <img src="/purple_wizard_logo.png" alt="Purple Wizard" />
          <span>Purple Wizard</span>
        </Link>

        {/* Right side */}
        <div className={styles.right}>
          <div className={styles.avatarWrapper}>
            <h1 onClick={() => setDropdownOpen(!dropdownOpen)} className={styles.account}>🧑‍💼</h1>
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
  );
}
