import { useState } from "react";
import styles from "../styles/components/CreditModal.module.scss";
import api from "../utils/api";

interface Props {
  onClose: () => void;
}

const creditTiers = [
  { name: "Starter Pack", credits: 5, price: 1.99 },
  { name: "Adventurer Pack", credits: 15, price: 4.99 },
  { name: "Hero Pack", credits: 30, price: 8.99 },
  { name: "Legend Pack", credits: 60, price: 14.99 },
  { name: "Mega Pack", credits: 120, price: 24.99 },
];

export default function CreditModal({ onClose }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(4); // Default: Legend Pack
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const selected = creditTiers[selectedIndex];
      const response = await api.post("/stripe/checkout", {
        credits: selected.credits,
        email:"omer-meraloglu@hotmail.com"//test
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
