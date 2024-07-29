import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

import { IShopContext, ShopContext } from "../context/shop-context";

export const Navbar = () => {
  const { userMoney, getAllCartProductCount } =
    useContext<IShopContext>(ShopContext);

  const total = getAllCartProductCount();

  return (
    <nav className="w-screen h-20 px-10 flex justify-between items-center text-white bg-blue-950">
      <h1 className="text-3xl font-semibold">
        <Link to="/">Ecommerce</Link>
      </h1>

      <ul className="flex items-center gap-10">
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
      </ul>
    </nav>
  );
};
