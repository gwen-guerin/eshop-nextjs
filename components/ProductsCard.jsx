import React, { useContext } from 'react';
import { BsFillCartPlusFill } from 'react-icons/bs';
import { ProductsContext } from './ProductsContext';

export default function ProductsCard({
  _id,
  name,
  price,
  description,
  picture,
}) {
  const { setSelectedProducts } = useContext(ProductsContext);
  function addProduct() {
    setSelectedProducts((prev) => [...prev, _id]);
    alert('Added to cart :)');
  }

  return (
    <div className="w-64">
      <div className="bg-slate-300 p-5 rounded-xl">
        <img src={picture} alt={name} />
      </div>
      <div className="mt-1">
        <h3 className="font-bold text-lg pl-1">{name}</h3>
      </div>
      <p className="text-sm mt-1 leading-4 text-gray-500">{description}</p>
      <div className="flex mt-1">
        <div className="text-2xl font-bold grow">${price}</div>

        <button
          onClick={addProduct}
          className="bg-emerald-400 text-white py-1 px-3 rounded-xl hover:scale-110 duration-150"
        >
          <BsFillCartPlusFill className="text-xl" />
        </button>
      </div>
    </div>
  );
}
