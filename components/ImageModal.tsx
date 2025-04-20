import React, { useEffect, useState } from "react";
import styles from "../styles/components/ImageModal.module.scss";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

export default function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  const [fadeOut, setFadeOut] = useState(false);

  const handleClose = () => {
    setFadeOut(true);
    setTimeout(onClose, 250); // matches fadeOut duration
  };

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <div
      className={`${styles.overlay} ${
        fadeOut ? styles.fadeOut : styles.fadeIn
      }`}
      onClick={handleClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Full screen scene" className={styles.image} />
        <button className={styles.close} onClick={handleClose}>X</button>
      </div>
    </div>
  );
}
