import CategoryList from '@/components/modules/admin/product-management/categories/CategoryList';
import Loading from '@/components/common/Loading';
import React, { Suspense } from 'react';

const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <CategoryList />
    </Suspense>
  );
};

export default page;