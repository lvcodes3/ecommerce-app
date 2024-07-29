// hook: get jwt token from client's cookies //

import { useCookies } from "react-cookie";

export const useGetToken = () => {
  const [cookies, _] = useCookies(["access_token"]);

  return {
    headers: {
      authorization: cookies.access_token,
    },
  };
};
