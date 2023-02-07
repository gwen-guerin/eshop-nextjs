import ProductsCard from '../components/ProductsCard';
import { useState } from 'react';
import { initMongoose } from '@/lib/connection';
import { findAllProducts } from './api/products';
import Layout from '@/components/Layout';

export default function Home({ products }) {
  const [phrase, setPhrase] = useState('');

  const categoriesNames = [...new Set(products.map((p) => p.category))];
  // let products;
  if (phrase) {
    products = products.filter((p) => p.name.toLowerCase().includes(phrase));
  }

  return (
    <Layout>
      <input
        value={phrase}
        onChange={(e) => setPhrase(e.target.value)}
        type="text"
        placeholder="Search for products ..."
        className="bg-gray-100 w-full p-2 rounded-xl"
      />
      <div>
        {categoriesNames.map((categoryName, i) => (
          <div key={i}>
            {products.find((p) => p.category === categoryName) && (
              <div>
                <h2 className="text-2xl py-5 capitalize">{categoryName}</h2>
                <div className="flex -mx-5 overflow-x-scroll snap-x scrollbar-hide">
                  {products
                    .filter((p) => p.category === categoryName)
                    .map((productInfo) => (
                      <div key={productInfo._id} className="px-5 snap-start">
                        <ProductsCard {...productInfo} />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await initMongoose();
  const products = await findAllProducts();
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
