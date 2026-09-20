import ProductList from '@/components/modules/admin/product-management/products/ProductList';
import Loading from '@/components/common/Loading';
import React, { Suspense } from 'react';

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ProductList />
    </Suspense>
  );
};

export default page;
