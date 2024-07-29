import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { IProduct } from "../models/interfaces";

import { useGetJWT } from "../hooks/useGetJWT";
import { useGetProducts } from "../hooks/useGetProducts";

export interface IShopContext {
  userMoney: number;
  getCartProductCount: (productId: string) => number;
  getAllCartProductCount: () => number;
  getTotalCartAmount: () => number;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartProductQuantity: (productId: string, newQuantity: number) => void;
  checkout: () => void;
}

const defaultValues: IShopContext = {
  userMoney: 0,
  getCartProductCount: () => 0,
  getAllCartProductCount: () => 0,
  getTotalCartAmount: () => 0,
  addToCart: () => null,
  removeFromCart: () => null,
  updateCartProductQuantity: () => null,
  checkout: () => null,
};

export const ShopContext = createContext<IShopContext>(defaultValues);

export const ShopContextProvider = (props) => {
  const navigate = useNavigate();

  const { headers } = useGetJWT();

  const { products } = useGetProducts();

  const [cartProducts, setCartProducts] = useState<{ string: number } | {}>({});

  const [userMoney, setUserMoney] = useState<number>(0);

  const getUserMoney = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/user/balance`, {
        headers,
      });
      setUserMoney(response.data.balance);
    } catch (err) {}
  };

  const getCartProductCount = (productId: string): number => {
    // productId exists //
    if (productId in cartProducts) {
      return cartProducts[productId];
    }
    // productId does not exist //
    else {
      return 0;
    }
  };

  const getAllCartProductCount = (): number => {
    // empty cart //
    if (
      Object.keys(cartProducts).length === 0 &&
      cartProducts.constructor === Object
    ) {
      return 0;
    }
    // non empty cart //
    else {
      let sum: number = 0;
      for (let key in cartProducts) {
        sum += cartProducts[key];
      }
      return sum;
    }
  };

  const getTotalCartAmount = (): number => {
    // empty cart //
    if (
      Object.keys(cartProducts).length === 0 &&
      cartProducts.constructor === Object
    ) {
      return 0;
    }
    // non empty cart //
    else {
      let totalAmount: number = 0;
      for (let key in cartProducts) {
        // product quantity greater than 0 //
        if (cartProducts[key] > 0) {
          let productInfo: IProduct = products.find(
            (product) => product._id === key
          );
          totalAmount += cartProducts[key] * productInfo.price;
        }
      }
      return totalAmount;
    }
  };

  const addToCart = (productId: string) => {
    // productId exists //
    if (cartProducts[productId]) {
      setCartProducts((prev) => ({
        ...prev,
        [productId]: prev[productId] + 1,
      }));
    }
    // productId does not exists //
    else {
      setCartProducts((prev) => ({ ...prev, [productId]: 1 }));
    }
  };

  const removeFromCart = (productId: string) => {
    // productId exists & quantity more than 0 //
    if (cartProducts[productId] && cartProducts[productId] > 0) {
      setCartProducts((prev) => ({
        ...prev,
        [productId]: prev[productId] - 1,
      }));
    }
  };

  const updateCartProductQuantity = (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity > -1) {
      setCartProducts((prev) => ({ ...prev, [productId]: newQuantity }));
    }
  };

  const checkout = async () => {
    try {
      const body = {
        cartProducts,
      };

      await axios.post("http://localhost:5000/products/checkout", body, {
        headers,
      });

      setCartProducts({});

      getUserMoney();

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserMoney();
  }, []);

  const contextValue: IShopContext = {
    userMoney,
    getCartProductCount,
    getAllCartProductCount,
    getTotalCartAmount,
    addToCart,
    removeFromCart,
    updateCartProductQuantity,
    checkout,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
