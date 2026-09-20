import Loading from '@/components/common/Loading';
import ProductEdit from '@/components/modules/admin/product-management/products/ProductEdit';
import React, { Suspense } from 'react';

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ProductEdit />
    </Suspense>
  );
};

export default page;
