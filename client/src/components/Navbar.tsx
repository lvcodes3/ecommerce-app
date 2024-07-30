import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FaShoppingCart } from "react-icons/fa";

import { IShopContext, ShopContext } from "../context/shop-context";

interface NavbarProps {
  authenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
}

export const Navbar = (props: NavbarProps) => {
  const { userMoney, getAllCartProductCount } =
    useContext<IShopContext>(ShopContext);

  const navigate = useNavigate();

  const [cookies, setCookies, removeCookies] = useCookies(["jwt"]);

  const total = getAllCartProductCount();

  const logout = () => {
    // auth remove //
    props.setAuthenticated(false);

    // remove cookie //
    removeCookies("jwt");

    // redirect to login page //
    navigate("/login");
  };

  return (
    <nav className="w-screen h-20 px-10 flex justify-between items-center text-white bg-blue-950">
      <h1 className="text-3xl font-semibold">
        <Link to="/">Ecommerce</Link>
      </h1>

      <ul className="flex items-center gap-10">
        {props.authenticated ? (
          <>
            <li className="text-lg font-medium">
              <Link to="/">Shop</Link>
            </li>
            <li className="text-lg font-medium">
              <Link to="/purchased-items">Purchases</Link>
            </li>
            <li>
              <Link to="/checkout" className="flex items-center gap-2">
                <FaShoppingCart className="w-6 h-6" />
                {total > 0 && <span>{total}</span>}
              </Link>
            </li>
            <li>${userMoney.toFixed(2)}</li>
            <li onClick={logout} className="text-lg font-medium">
              Logout
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/register" className="">
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" className="">
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
