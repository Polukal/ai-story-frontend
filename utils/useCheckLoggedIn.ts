import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

//This hook makes a check api call to the backend and sets the is logged in status true based on its response.
export function useCheckLoggedIn() {
  const { setIsLoggedIn } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("/api/auth/check", {
          withCredentials: true,
        });
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);
}
