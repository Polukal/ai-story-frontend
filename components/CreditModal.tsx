import { useState } from "react";
import styles from "../styles/components/CreditModal.module.scss";
import api from "../utils/api";

interface Props {
  onClose: () => void;
}

const creditTiers = [
  { name: "Single Credit", credits: 1, price: 2.49 },
  { name: "Starter Pack", credits: 3, price: 6.99 },
  { name: "Adventurer Pack", credits: 10, price: 21.99 },
  { name: "Hero Pack", credits: 25, price: 49.99 },
  { name: "Legend Pack", credits: 50, price: 89.99 },
];

export default function CreditModal({ onClose }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(4); // Default: Legend Pack
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const selected = creditTiers[selectedIndex];
      const response = await api.post("/api/stripe/checkout", {
        credits: selected.credits,
      });
      window.location.href = response.data.sessionUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Buy Credits 💎</h2>
        <p className={styles.subtitle}>Choose your pack and level up your story magic!</p>

        <div className={styles.creditOptions}>
          {creditTiers.map((tier, index) => (
            <button
              key={tier.name}
              className={`${styles.optionButton} ${selectedIndex === index ? styles.selected : ""}`}
              onClick={() => setSelectedIndex(index)}
            >
              <div className={styles.tierName}>{tier.name}</div>
              <div>{tier.credits} Credits</div>
              <div>${tier.price.toFixed(2)}</div>
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handlePurchase} disabled={loading} className={styles.buyButton}>
            {loading ? "Redirecting..." : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
