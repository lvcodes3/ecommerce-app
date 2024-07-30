import { useContext } from "react";
import { IProduct } from "../models/interfaces";
import { IShopContext, ShopContext } from "../context/shop-context";

interface PurchasedProductProps {
  product: IProduct;
  productCount: number;
}

export const PurchasedProduct = (props: PurchasedProductProps) => {
  const { _id, productName, price, imageURL } = props.product;

  const productCount = props.productCount;

  const { addToCart } = useContext<IShopContext>(ShopContext);

  return (
    <div className="w-[375px] h-[350px] flex flex-col items-center gap-1 bg-white shadow-lg">
      <h3 className="h-[35px] text-2xl text-center font-semibold overflow-hidden">
        {productName}
      </h3>

      <img src={imageURL} alt={productName} className="w-[180px] h-[180px]" />

      <p className="text-center font-semibold">${price.toFixed(2)}</p>

      <button
        onClick={() => addToCart(_id)}
        className="m-auto px-2 py-1 font-medium border-[1px] border-black rounded-md bg-green-200 hover:bg-green-300"
      >
        Purchase Again {productCount > 0 && <span>({productCount})</span>}
      </button>
    </div>
  );
};
