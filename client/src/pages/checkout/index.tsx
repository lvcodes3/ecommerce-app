import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { IShopContext, ShopContext } from "../../context/shop-context";

import { IProduct } from "../../models/interfaces";

import { useGetProducts } from "../../hooks/useGetProducts";

import { CartProduct } from "../../components/CartProduct";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const { products } = useGetProducts();

  const { getCartProductCount, getTotalCartAmount, checkout } =
    useContext<IShopContext>(ShopContext);

  const totalAmount: number = getTotalCartAmount();

  return (
    <div className="w-screen min-h-[calc(100vh-80px)] py-10 flex flex-col items-center gap-5 bg-blue-100">
      <h1 className="text-3xl text-center font-semibold">Your Cart Items</h1>

      <div className="flex flex-col gap-5">
        {products.map((product: IProduct, index) => {
          if (getCartProductCount(product._id) !== 0) {
            return <CartProduct product={product} key={index} />;
          }
        })}
      </div>

      {totalAmount > 0 ? (
        <div className="flex flex-col items-center gap-5">
          <p>Subtotal: ${totalAmount.toFixed(2)}</p>

          <div className="flex gap-5">
            <button
              onClick={() => navigate("/")}
              className="px-2 py-1 font-medium border-[1px] border-black rounded-md bg-green-200 hover:bg-green-300"
            >
              Continue Shopping
            </button>
            <button
              onClick={checkout}
              className="px-2 py-1 font-medium border-[1px] border-black rounded-md bg-green-200 hover:bg-green-300"
            >
              Checkout
            </button>
          </div>
        </div>
      ) : (
        <p>Your shopping cart is empty...</p>
      )}
    </div>
  );
};
export default CheckoutPage;
