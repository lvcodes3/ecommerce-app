import { useContext } from "react";

import { IShopContext, ShopContext } from "../../context/shop-context";

import { PurchasedProduct } from "../../components/PurchasedProduct";

const PurchasedItemsPage = () => {
  const { purchasedProducts, getCartProductCount } =
    useContext<IShopContext>(ShopContext);

  return (
    <div className="w-screen min-h-[calc(100vh-80px)] p-10 flex flex-col items-center gap-5 bg-blue-100">
      <h1 className="text-3xl text-center font-semibold">
        Previously Purchased Items
      </h1>

      <div className="w-full flex justify-center flex-wrap gap-10">
        {purchasedProducts.map((product, index) => {
          const productCount = getCartProductCount(product._id);
          return (
            <PurchasedProduct
              product={product}
              productCount={productCount}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
};
export default PurchasedItemsPage;
