import Loading from '@/components/common/Loading';
import ProductCreate from '@/components/modules/admin/product-management/products/ProductCreate';
import React, { Suspense } from 'react';

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ProductCreate />
    </Suspense>
  );
};

export default page;
