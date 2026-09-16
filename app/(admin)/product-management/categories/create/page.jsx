import Loading from '@/components/common/Loading';
import CategoryCreate from '@/components/modules/admin/product-management/categories/CategoryCreate';
import React, { Suspense } from 'react';

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <CategoryCreate />
    </Suspense>
  );
};

export default page;
