import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import type { ComponentType, JSX } from "react";

export default function withAuth<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: ComponentType<P>
) {
  return function AuthGuard(props: P) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.replace("/login");
      }
    }, [isAuthenticated]);

    if (!isAuthenticated) return null;

    return <WrappedComponent {...props} />;
  };
}
