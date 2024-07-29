import { useContext } from "react";

import { IProduct } from "../models/interfaces";

import { IShopContext, ShopContext } from "../context/shop-context";

interface ProductProps {
  product: IProduct;
}

export const Product = (props: ProductProps) => {
  const { _id, productName, description, price, stockQuantity, imageURL } =
    props.product;

  const { addToCart, getCartProductCount } =
    useContext<IShopContext>(ShopContext);

  const productCount = getCartProductCount(_id);

  return (
    <div className="w-[425px] h-[450px] flex flex-col items-center gap-1 bg-white shadow-lg">
      <h1 className="h-[35px] text-2xl text-center font-semibold overflow-hidden">
        {productName}
      </h1>

      <img src={imageURL} alt={productName} className="w-[180px] h-[180px]" />

      <div className="w-full h-[125px] p-2 overflow-scroll">
        <p className="">{description}</p>
      </div>

      <p className="text-center font-semibold">${price}</p>

      <button
        onClick={() => addToCart(_id)}
        className="m-auto px-2 py-1 font-medium border-[1px] border-black rounded-md bg-green-200 hover:bg-green-300"
      >
        Add To Cart {productCount > 0 && <span>({productCount})</span>}
      </button>

      <div className="text-center font-semibold">
        {stockQuantity === 0 && <h1>Out Of Stock</h1>}
      </div>
    </div>
  );
};
