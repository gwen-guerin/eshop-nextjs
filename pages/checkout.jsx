import Layout from '@/components/Layout';
import { ProductsContext } from '@/components/ProductsContext';
import React, { useContext, useEffect, useState } from 'react';

export default function checkout() {
  const { selectedProducts, setSelectedProducts } = useContext(ProductsContext);
  const [productsInfos, setProductsInfos] = useState([]);
  const [adress, setAdress] = useState('');
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const uniqIds = [...new Set(selectedProducts)];
    fetch('/api/products?ids=' + uniqIds.join(','))
      .then((res) => res.json())
      .then((json) => setProductsInfos(json));
  }, [selectedProducts]);

  const moreOfThisProducts = (id) => {
    setSelectedProducts((prev) => [...prev, id]);
  };
  const lessOfThisProducts = (id) => {
    const pos = selectedProducts.indexOf(id);
    if (pos !== -1) {
      setSelectedProducts((prev) => {
        return prev.filter((value, index) => index !== pos);
      });
    }
  };
  const deliveryPrice = 8.99;
  let subtotal = 0;
  if (selectedProducts?.length) {
    for (let id of selectedProducts) {
      const price = productsInfos.find((p) => p._id === id)?.price || 0;
      subtotal += price;
    }
  }
  const total = subtotal + deliveryPrice;

  return (
    <Layout>
      {!productsInfos.length && <div>Cart's empty...</div>}
      {productsInfos.length &&
        productsInfos.map((productInfo) => {
          const amount = selectedProducts.filter(
            (id) => id === productInfo._id
          ).length;
          if (amount === 0) return;
          return (
            <div className="flex mb-5" key={productInfo._id}>
              <div className="bg-gray-100 p-3 rounded-xl shrink-0">
                <img
                  className="w-24"
                  src={productInfo.picture}
                  alt={productInfo.name}
                />
              </div>
              <div className="pl-4">
                <h3 className="font-bold text-lg">{productInfo.name}</h3>
                <p className="text-sm leading-4 text-gray-500">
                  {productInfo.description}
                </p>
                <div className="flex">
                  <div className="grow">${productInfo.price}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => lessOfThisProducts(productInfo._id)}
                      className="w-7 border border-emerald-500 px-2 rounded-lg text-emerald-500"
                    >
                      -
                    </button>
                    <span className="px-2">
                      {
                        selectedProducts.filter((id) => id === productInfo._id)
                          .length
                      }
                    </span>
                    <button
                      onClick={() => moreOfThisProducts(productInfo._id)}
                      className="w-7 border border-emerald-500 px-2 rounded-lg text-emerald-500"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      <form action="/api/checkout" method="POST">
        <div className="flex flex-col gap-2 mt-10">
          <input
            name="adress"
            value={adress}
            onChange={(e) => setAdress(e.target.value)}
            className="bg-gray-100 w-full p-2 rounded-xl"
            type="text"
            placeholder="Street Address, Number"
          />
          <input
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-gray-100 w-full p-2 rounded-xl"
            type="text"
            placeholder="City & Postal Code"
          />
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-100 w-full p-2 rounded-xl"
            type="text"
            placeholder="Full Name"
          />
          <input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-100 w-full p-2 rounded-xl"
            type="email"
            placeholder="Email Adress"
          />
        </div>
        <div className="mt-4">
          <div className="flex my-3">
            <h3 className="font-bold grow text-gray-400">Subtotal : </h3>
            <h3 className="font-bold">${subtotal}</h3>
          </div>
          <div className="flex my-3">
            <h3 className="font-bold grow text-gray-400">Delivery : </h3>
            <h3 className="font-bold">${deliveryPrice}</h3>
          </div>
          <div className="flex my-3 border-t-2 border-dashed border-emerald-500">
            <h3 className="font-bold grow text-gray-400 mt-4">Total : </h3>
            <h3 className="mt-4 font-bold">${total}</h3>
          </div>
        </div>
        <input
          type="hidden"
          name="products"
          value={selectedProducts.join(',')}
        />
        <button className="bg-white border hover:text-white border-emerald-500 px-5 py-2 text-emerald-500 w-full font-bold rounded-xl my-4 duration-300 relative after:absolute after:top-0 after:right-full after:bg-emerald-500 after:z-10 after:w-full after:h-full overflow-hidden hover:after:translate-x-full after:duration-300 ">
          <span className="relative z-20">Pay ${total}</span>
        </button>
      </form>
    </Layout>
  );
}
