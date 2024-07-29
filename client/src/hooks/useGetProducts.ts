import { useEffect, useState } from "react";
import axios from "axios";

import { IProduct } from "../models/interfaces";

import { useGetJWT } from "./useGetJWT";

export const useGetProducts = () => {
  const { headers } = useGetJWT();

  const [products, setProducts] = useState<IProduct[]>([]);

  const getProducts = async () => {
    try {
      const dbProducts = await axios.get("http://localhost:5000/products", {
        headers,
      });
      setProducts(dbProducts.data.products);
    } catch (err) {
      alert("ERROR");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return { products };
};
