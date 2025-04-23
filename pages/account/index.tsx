import { useEffect, useState } from "react";
import api from "../../utils/api";
import styles from "../../styles/pages/Account.module.scss";
import { withAuthSSR } from "../../utils/withAuthSSR";
import { useAuth } from "@/contexts/AuthContext";

export const getServerSideProps = withAuthSSR();

export default function AccountPage() {

  const { setIsLoggedIn } = useAuth();

  useEffect(() => {
      //set context logged in true because the SSR succeeded.
      setIsLoggedIn(true)
  }, []);

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleBuyCredits = async () => {
    try {
      const res = await api.post("/stripe/checkout", {
        email: profile.email,
        credits: 10,
      });

      const sessionUrl = res.data.sessionUrl;
      if (sessionUrl) {
        window.location.href = sessionUrl;
      }
    } catch (err) {
      console.error("Checkout session error:", err);
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
        <p><strong>Credits:</strong> {profile.credits ?? 0}</p>

        <button onClick={handleBuyCredits} className={styles.button}>
          Buy Credits 💎
        </button>
      </div>
    </>
  );
}
