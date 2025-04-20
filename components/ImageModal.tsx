import React from "react";
import styles from "../styles/components/ImageModal.module.scss";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

export default function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal}>
        <img src={imageUrl} alt="Full screen scene" className={styles.image} />
        <button className={styles.close} onClick={onClose}>X</button>
      </div>
    </div>
  );
}
