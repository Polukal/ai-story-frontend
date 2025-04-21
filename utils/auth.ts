import api from "./api";

export function isLoggedIn(): boolean {
  return true;
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.error("Logout error", err);
  }
}
