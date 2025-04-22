import { useEffect, useState } from "react";
import api from "../../utils/api";
import styles from "../../styles/pages/Account.module.scss";

export default function AccountPage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile", { withCredentials: true });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleBuyCredits = async () => {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
    });

    const data = await res.json();
    if (data.sessionUrl) {
      window.location.href = data.sessionUrl;
    }
  };


  if (!profile) return <div className={styles.loading}>Loading profile...</div>;

  return (
    <>
      <h1 className={styles.title}>👤 My Account</h1>
      <div className={styles.card}>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>First Name:</strong> {profile.first_name}</p>
        <p><strong>Last Name:</strong> {profile.last_name}</p>
        <p><strong>Phone:</strong> {profile.phone}</p>

        <button onClick={handleBuyCredits} className={styles.button}>
          Buy Credits 💎
        </button>

      </div>
    </>
  );
}
