import { useGetProducts } from "../../hooks/useGetProducts";

import { Product } from "../../components/Product";

const ShopPage = () => {
  const { products } = useGetProducts();

  return (
    <div className="py-10 bg-blue-100">
      <div className="flex justify-center flex-wrap gap-10">
        {products.map((product, index) => (
          <Product product={product} key={index} />
        ))}
      </div>
    </div>
  );
};
export default ShopPage;
