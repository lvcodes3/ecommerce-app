// hook: get all products from backend //

import { useEffect, useState } from "react";
import axios from "axios";

import { useGetToken } from "./useGetToken";

import { IProduct } from "../models/interfaces";

export const useGetProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  const { headers } = useGetToken();

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await axios.get("http://localhost:5000/product", {
        headers,
      });
      setProducts(fetchedProducts.data.products);
    } catch (err) {
      alert("ERROR");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products };
};