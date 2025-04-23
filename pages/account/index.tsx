import { useEffect, useState } from "react";
import api from "../../utils/api";
import styles from "../../styles/pages/Account.module.scss";
import { withAuthSSR } from "../../utils/withAuthSSR";
import { useAuth } from "@/contexts/AuthContext";

export const getServerSideProps = withAuthSSR();

export default function AccountPage() {
  const { setIsLoggedIn } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    setIsLoggedIn(true);
  }, []);

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

  if (!profile) return <div className={styles.loading}>Loading profile...</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <img src="/avatar_wizard.png" alt="avatar" className={styles.avatar} />
          <h2>{profile.username}</h2>
          <p>Level {profile.level || 15}</p>
          <p>Credits: {profile.credits ?? 0}</p>
        </div>

        <div className={styles.statsSection}>
          <ProfileStat label="First Name" value={profile.first_name || "N/A"} />
          <ProfileStat label="Last Name" value={profile.last_name || "N/A"} />
          <ProfileStat label="Email" value={profile.email} />
          <ProfileStat label="Phone" value={profile.phone || "N/A"} />
        </div>

        <div className={styles.equipmentSection}>
          <h3>Settings</h3>
          <div className={styles.equipmentGrid}>
            <div className={styles.eqIcon}>🔒<span>Change Password</span></div>
            <div className={styles.eqIcon}>🎨<span>Theme</span></div>
            <div className={styles.eqIcon}>🔔<span>Notifications</span></div>
            <div className={styles.eqIcon}>🌐<span>Language</span></div>
          </div>
        </div>

        <div className={styles.inventorySection}>
          <h3>Account Info</h3>
          <div className={styles.inventoryGrid}>
            <div className={styles.invIcon}>📅<span>Joined: {profile.joined || "N/A"}</span></div>
            <div className={styles.invIcon}>⏱<span>Last Login: {profile.last_login || "N/A"}</span></div>
            <div className={styles.invIcon}>🆔<span>ID: {profile.id}</span></div>
            <div className={styles.invIcon}>🛡️<span>Status: Active</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.profileStat}>
      <label>{label}</label>
      <div className={styles.statValue}>{value}</div>
    </div>
  );
}
