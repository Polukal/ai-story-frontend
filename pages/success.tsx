import { useEffect } from "react";
import styles from "../styles/pages/Account.module.scss";
import { withAuthSSR } from "../utils/withAuthSSR";
import { useAuth } from "@/contexts/AuthContext";

export const getServerSideProps = withAuthSSR();

export default function AccountPage() {
    const { setIsLoggedIn } = useAuth();

    useEffect(() => {
        //set context logged in true because the SSR succeeded.
        setIsLoggedIn(true)
    }, []);

    // Make a POST to the backend to increment the credits of the user.
    return (
        <>
            <h1 className={styles.title}>Credits Bought!!</h1>
        </>
    );
}
