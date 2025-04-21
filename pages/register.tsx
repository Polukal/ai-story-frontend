import { useState } from "react";
import { useRouter } from "next/router";
import api from "../utils/api";
import "react-phone-input-2/lib/style.css";
import styles from "../styles/pages/Auth.module.scss";
import Link from "next/link";
import PhoneInput from "react-phone-input-2";
import Navbar from "@/components/Navbar";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", {
        email,
        username,
        first_name: firstName,
        last_name: lastName,
        phone,
        password,
      });
      router.push("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Your Account</h2>
      <form className={styles.form} onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <div className={styles.row}>
            <input
              type="text"
              placeholder="First Name"
              className={styles.inputHalf}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className={styles.inputHalf}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
        </div>


        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className={styles.phoneWrapper}>
          <PhoneInput
            country={"us"}
            value={phone}
            onChange={(phone) => setPhone(phone)}
            inputStyle={{
              width: "100%",
              borderRadius: "8px",
              fontSize: "1rem",
              backgroundColor: "#2a2a2c",
              border: "1px solid #444",
              color: "#fff",
            }}
            buttonStyle={{
              backgroundColor: "#2a2a2c",
              border: "1px solid #444",
              borderRadius: "8px 0 0 8px",
            }}
            containerStyle={{ width: "100%" }}
            inputProps={{
              name: "phone",
              required: true,
            }}
          />
        </div>

        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles.button}>Register</button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Already have an account?{" "}
        <Link href="/login" className={styles.link}>Login</Link>
      </p>
    </div>
  );
}
