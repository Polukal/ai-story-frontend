import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";

export function withAuthSSR(gssp?: GetServerSideProps): GetServerSideProps {
  return async (context: GetServerSidePropsContext) => {
    const cookies = parseCookies(context);
    const token = cookies.access_token_cookie;

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    if (gssp) {
      return await gssp(context);
    }

    return { props: {} };
  };
}
