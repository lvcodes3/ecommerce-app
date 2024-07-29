import { useCookies } from "react-cookie";

export const useGetJWT = () => {
  const [cookies, _] = useCookies(["jwt"]);

  return {
    headers: {
      authorization: cookies.jwt,
    },
  };
};
