import { useContext } from "react";
import { IProduct } from "../models/interfaces";
import { IShopContext, ShopContext } from "../context/shop-context";
import { FaMinus, FaPlus } from "react-icons/fa";

interface CartProductProps {
  product: IProduct;
}

export const CartProduct = (props: CartProductProps) => {
  const { _id, productName, price, imageURL } = props.product;

  const {
    addToCart,
    removeFromCart,
    updateCartProductQuantity,
    getCartProductCount,
  } = useContext<IShopContext>(ShopContext);

  const productCount = getCartProductCount(_id);

  return (
    <div className="w-[450px] h-[175px] p-1 flex justify-center gap-1 rounded-lg shadow-lg bg-white">
      <img
        src={imageURL}
        alt={productName}
        className="m-auto w-[150px] h-[150px] flex-[2]"
      />

      <div className="flex-[8] flex flex-col justify-center gap-3 overflow-hidden">
        <h1 className="h-[35px] text-2xl text-center font-semibold overflow-hidden">
          {productName}
        </h1>

        <p className="text-center font-semibold">Price: ${price}</p>

        <div className="flex justify-center items-center gap-3">
          <button
            onClick={() => removeFromCart(_id)}
            className="px-2 py-1 font-medium border-[1px] border-black rounded-md bg-green-200 hover:bg-green-300"
          >
            <FaMinus />
          </button>
          <input
            type="text"
            value={productCount}
            onChange={(e) =>
              updateCartProductQuantity(_id, Number(e.target.value))
            }
            className="w-[30px] text-center border-[1px] border-black"
          />
          <button
            onClick={() => addToCart(_id)}
            className="px-2 py-1 font-medium border-[1px] border-black rounded-md bg-green-200 hover:bg-green-300"
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
};
